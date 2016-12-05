estado_inicial([[[],[],[],[],[],[],[],[]],
							 [[],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[]],
							 [[],[1],[1],[1],[1],[1],[1],[]],
							 [[],[],[],[],[],[],[],[]],
							 [[],[],[],[],[],[],[],[]],
							 [[],[2],[2],[2],[2],[2],[2],[]],
							 [[],[2,2],[2,2],[2,2],[2,2],[2,2],[2,2],[]],
							 [[],[],[],[],[],[],[],[]]]).

estado_auxiliar([[[7],[7],[7],[7],[7],[7],[7],[7]],
							 	 [[7],[6],[6],[6],[6],[6],[6],[7]],
							 	 [[7],[6],[5],[5],[5],[5],[6],[7]],
							 	 [[7],[6],[5],[4],[4],[5],[6],[7]],
							 	 [[7],[6],[5],[4],[4],[5],[6],[7]],
							 	 [[7],[6],[5],[5],[5],[5],[6],[7]],
							 	 [[7],[6],[6],[6],[6],[6],[6],[7]],
							 	 [[7],[7],[7],[7],[7],[7],[7],[7]]]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                    Predicados principais do jogo                     %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

inicio:-
		menu(0).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                    Menus e apresentação                  					  %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

menu(0):-
      menu(0, []).
menu(0, []):-
      estado_inicial(Tab),
			estado_auxiliar(Sizes),
      menu(0, Tab, Sizes).
menu(0, Tab, Sizes) :-
      write('Welcome to SPLAY Game!'), nl, nl,
      write('* Menu *'),nl,
      write('1 - Play : 2 Players'),nl,
      write('2 - Instructions'), nl,
      write('3 - Exit'), nl, nl,
      write('Your option: '),
      read(Option),
      valid_menu_option(Option, 3, ValidOption),!,
      menu(ValidOption, Tab, Sizes).
menu(3, _, _).
menu(1, Tab, Sizes):-
      nl, nl,
      write('* Player 1 vs. Player 2'), nl,
      pick_first_player(StartingPlayer), nl,!,
      game_cycle(StartingPlayer, Tab, 1, 0, Sizes),
      !.
menu(2, Tab, Sizes):-
	write('You have 2 possible moves in this game, STEP and SPLAY:'),nl,
	write('Step you move one unit in any direction you wish, the stack you pick will be placed on top of the stack present on the destination cell.'),nl,
	write('Splay consists of taking an entire stack with the player color on top and spreading it out in a straight line in any direction.'),nl,
	write('There are a few rules:'),nl,
	write('1- Any stack you wish to move has to have one of tour pieces on the top.'),nl,
	write('2- Any play you choose that would generate a cell that cannot SPLAY is illegal.'),nl,
	write('3- The play you choose cannot carry stones out of the board.'),nl,
	write('At the end of each turn any piece from player 1 present on row 1 will be captured, the same goes for player 2 but on row 8.'),nl,
	write('The first player to capture 9 stones wins.'),nl,nl,
	menu(0, Tab, Sizes).

% Checks if the option is valid
% valid_menu_option(Option, ValidOption)
valid_menu_option(Option, NumberOfOptions, ValidOption):-
      Option>0, Option=<NumberOfOptions,
      	ValidOption=Option;
      write('Invalid option. Please choose a number between 1 and '), write(NumberOfOptions), write(' : '),
      read(NewOption),
      valid_menu_option(NewOption, NumberOfOptions, ValidOption).

% Asks the user who should begin to play
% pick_first_player(-PlayerId)
pick_first_player(PlayerId):-
      nl,
      write('You need to pick a player to begin. Throw a coin!'), nl,
      write('Please choose the player that will begin (1 or 2): '),
      read(Id),
      PlayerId is Id.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                    Visualização de estado do jogo                    %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

visualiza_estado(Tab):-
	nl, write('     0         1        2        3        4        5        6        7'), nl, nl,
	mostra_linhas(0,Tab),
	write('     0         1        2        3        4        5        6        7'), nl,!.

mostra_linhas(_,[]).
mostra_linhas(N,[Lin|Resto]):-
	write(N), write(' '), mostra_linha(Lin), write(' '), write(N), nl, nl,
	N2 is N+1,
	mostra_linhas(N2, Resto).

mostra_linha([]).
mostra_linha([El|Resto]):-
	escreve(El,7), write('|'),
	mostra_linha(Resto).

escreve([],0):-
	write(' ').
escreve([],N):-
  write(' '),
	N1 is N - 1,
	escreve([],N1).
escreve([El|Rest],N):-
	write(El),
	N1 is N - 1,
	escreve(Rest, N1).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                    Lógica de jogo                    								%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%predicado responsavel pelo ciclo de jogo
game_cycle(Current_Player,Tab,Mode,0, SizesTab):-
				play(Current_Player,Tab,NewTab,Winner,SizesTab),
				switch_player(Current_Player,Mode,Next_Player),
				game_cycle(Next_Player,NewTab,Mode,Winner,SizesTab).
game_cycle(_,_,_,1,_):-
	write('Player 1 Won the game!!!!!!!!!!!!!').
game_cycle(_,_,_,2,_):-
	write('Player 2 Won the game!!!!!!!!!!!!!').

%predicados para a troca de jogador apos a jogada
switch_player(1, 1, Next_Player):- Next_Player=2.
switch_player(2, 1, Next_Player):- Next_Player=1.
switch_player(1, 2, Next_Player):- Next_Player=4.
switch_player(4, 2, Next_Player):- Next_Player=1.
switch_player(3, 3, Next_Player):- Next_Player=4.
switch_player(4, 3, Next_Player):- Next_Player=3.

%predicado para a realizacao da jogada
play(Current_Player,Tab,NewTab,Winner,SizesTab):-
	visualiza_estado(Tab),
	nl,write('It is player '), write(Current_Player), write(' turn!'),nl,
	write('Type of play: STEP - 1    SPLAY - 2  '), nl,
	read(Type),
	write('Row of origin: '), nl,
	read(Row),
	write('Column of origin'),nl,
	read(Column),
	write('Row of destination: '),nl,
	read(NewRow),
	write('Column of destination: '),nl,
	read(NewColumn),
	validate_out_of_bonds(Tab,Current_Player,NewRow,NewColumn,SizesTab),
	check_top_piece(Tab,Row,Column,Current_Player,SizesTab),
	make_play(Type,Row,Column,NewRow,NewColumn,Tab,AuxTab,SizesTab,Current_Player),
	capture(AuxTab,NewTab),
	check_winner(NewTab,Current_Player,Winner),
	!.

%predicado auxiliar à realizacao da jogada
make_play(Type,Row,Column,NewRow,NewColumn,Tab,NewTab,SizesTab,Player):-
	Type == 2,
			splay_type(Row,Column,NewRow,NewColumn,Type2),
			splay(Type2,Row,Column,Tab,NewTab,SizesTab,Player,Tab);
			validate_step(Row,Column,NewRow,NewColumn,Player,Tab,SizesTab),
			step(Row,Column,NewRow,NewColumn,Tab,NewTab,SizesTab,Player).

%Traduz as coordenadas do utilizador no tipo de splay pretendido
splay_type(Row,Column,NewRow,NewColumn,Type2):-
	NewColumn<Column, NewRow=:=Row,
		Type2 = 0;
	NewColumn=:=Column, NewRow>Row,
		Type2 = 1;
	NewColumn>Column, NewRow=:=Row,
		Type2 = 2;
	NewColumn=:=Column, NewRow<Row,
		Type2 = 3;
	NewColumn<Column, NewRow>Row,
		Type2 = 4;
	NewColumn>Column, NewRow>Row,
		Type2 = 5;
	NewColumn>Column, NewRow<Row,
		Type2 = 6;
	NewColumn<Column, NewRow<Row,
		Type2 = 7;
	write('Please pick appropriate coordinates'),nl.

%predicado para a realizacao da jogada Splay
splay(0,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	spread_element(0,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(1,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	spread_element(1,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	get_from_board(NewTab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(2,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	spread_element(2,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(3,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	spread_element(3,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	get_from_board(NewTab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(4,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	spread_element(4,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(5,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	spread_element(5,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(6,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	spread_element(6,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

splay(7,Row,Column,Tab,AuxTab,SizesTab,Player,InitialTab):-
	get_piece(Tab,Row,Column,Element),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	spread_element(7,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab),
	replace(NewTab,Column,EditedLinhaInicial,AuxTab).

%predicado auxiliar para a execução da jogada Splay, os direntes tipos são à orientaçao da jogada
spread_element(0,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(0,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Column2 is Column - 1,
	get_piece(Tab,Row,Column2,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row,Column2,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column2,LinhaFinal),
	replace(LinhaFinal,Row,Element3,EditedLinhaFinal),
	replace(Tab,Column2,EditedLinhaFinal,NewTab2),
	spread_element(0,Rest,Row,Column2,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(1,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(1,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Row2 is Row + 1,
	get_piece(Tab,Row2,Column,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row2,Column,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column,LinhaFinal),
	replace(LinhaFinal,Row2,Element3,EditedLinhaFinal),
	replace(Tab,Column,EditedLinhaFinal,NewTab2),
	spread_element(1,Rest,Row2,Column,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(2,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(2,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Column2 is Column + 1,
	get_piece(Tab,Row,Column2,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row,Column2,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column2,LinhaFinal),
	replace(LinhaFinal,Row,Element3,EditedLinhaFinal),
	replace(Tab,Column2,EditedLinhaFinal,NewTab2),
	spread_element(2,Rest,Row,Column2,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(3,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(3,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Row2 is Row - 1,
	get_piece(Tab,Row2,Column,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row2,Column,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column,LinhaFinal),
	replace(LinhaFinal,Row2,Element3,EditedLinhaFinal),
	replace(Tab,Column,EditedLinhaFinal,NewTab2),
	spread_element(3,Rest,Row2,Column,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(4,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(4,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Row2 is Row + 1,
	Column2 is Column - 1,
	get_piece(Tab,Row2,Column2,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row2,Column2,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column2,LinhaFinal),
	replace(LinhaFinal,Row2,Element3,EditedLinhaFinal),
	replace(Tab,Column2,EditedLinhaFinal,NewTab2),
	spread_element(4,Rest,Row2,Column2,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(5,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(5,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Row2 is Row + 1,
	Column2 is Column + 1,
	get_piece(Tab,Row2,Column2,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row2,Column2,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column2,LinhaFinal),
	replace(LinhaFinal,Row2,Element3,EditedLinhaFinal),
	replace(Tab,Column2,EditedLinhaFinal,NewTab2),
	spread_element(5,Rest,Row2,Column2,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(6,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(6,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Row2 is Row - 1,
	Column2 is Column + 1,
	get_piece(Tab,Row2,Column2,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row2,Column2,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column2,LinhaFinal),
	replace(LinhaFinal,Row2,Element3,EditedLinhaFinal),
	replace(Tab,Column2,EditedLinhaFinal,NewTab2),
	spread_element(6,Rest,Row2,Column2,NewTab2,NewTab,SizesTab,Player,InitialTab).

spread_element(7,[],_Row,_Column,Tab,Tab,_SizesTab,_Player,_InitialTab).
spread_element(7,Element,Row,Column,Tab,NewTab,SizesTab,Player,InitialTab):-
	Element = [First|Rest],
	Row2 is Row - 1,
	Column2 is Column - 1,
	get_piece(Tab,Row2,Column2,Element2),
	append([First],Element2,Element3),
	check_max_size(Element3,Row2,Column2,SizesTab,InitialTab,Player),
	get_from_board(Tab,Column2,LinhaFinal),
	replace(LinhaFinal,Row2,Element3,EditedLinhaFinal),
	replace(Tab,Column2,EditedLinhaFinal,NewTab2),
	spread_element(7,Rest,Row2,Column2,NewTab2,NewTab,SizesTab,Player,InitialTab).

%predicado para a realização da jogada step
step(Row,Column,NewRow,NewColumn,Tab,NewTab,SizesTab,Player):-
	get_piece(Tab,Row,Column,Element),
	get_piece(Tab,NewRow,NewColumn,Element2),
	set_piece(Row,Column,NewRow,NewColumn,Element,Element2,Tab,NewTab,SizesTab,Player).

%predicado auxiliar para a realização da jogada step
set_piece(Row,Column,NewRow,NewColumn,Element,Element2,Tab,NewTab,SizesTab,Player):-
	append(Element,Element2,Element3),
	check_max_size(Element3,NewRow,NewColumn,SizesTab,Tab,Player),
	get_from_board(Tab,NewColumn,LinhaFinal),
	replace(LinhaFinal,Row,[],EditedLinhaFinal),
	replace(EditedLinhaFinal,NewRow,Element3,EditedLinhaFinal2),
	get_from_board(Tab,Column,LinhaInicial),
	replace(LinhaInicial,Row,[],EditedLinhaInicial),
	replace(Tab,Column,EditedLinhaInicial,AuxTab),
	replace(AuxTab,NewColumn,EditedLinhaFinal2,NewTab).


% Replaces the content at Index position in List with NewValue and returns the modified NewList
% replace(+List, +Index, +NewValue, -NewList)
replace([_|Tail], 0, NewValue, [NewValue|Tail]).
replace([Head|Tail], Index, NewValue, [Head|R]):-
        Index > 0, Index1 is Index-1,
        replace(Tail, Index1, NewValue, R).

% get_piece/4
% get an piece from board
get_piece(Tab, X, Y, Element) :-
  get_from_board(Tab, Y, Row),
  get_from_board(Row, X, Element).

% get_from_board/3
% get something from a certain position of the board
get_from_board([Head|_],0,Head).
get_from_board([_Head|Tail],Pos,Elem):-
  Pos \= 0,
  NewPos is Pos - 1,
  get_from_board(Tail,NewPos,Elem).


%predicado responsavel pela captura
capture(Tab,NewTab):-
	get_piece(Tab, 0, 0, Element0),
	delMember(1,Element0,ElementFinal0),
	get_piece(Tab, 1, 0, Element1),
	delMember(1,Element1,ElementFinal1),
	get_piece(Tab, 2, 0, Element2),
	delMember(1,Element2,ElementFinal2),
	get_piece(Tab, 3, 0, Element3),
	delMember(1,Element3,ElementFinal3),
	get_piece(Tab, 4, 0, Element4),
	delMember(1,Element4,ElementFinal4),
	get_piece(Tab, 5, 0, Element5),
	delMember(1,Element5,ElementFinal5),
	get_piece(Tab, 6, 0, Element6),
	delMember(1,Element6,ElementFinal6),
	get_piece(Tab, 7, 0, Element7),
	delMember(1,Element7,ElementFinal7),
	get_from_board(Tab,0,LinhaBrancas),
	replace(LinhaBrancas,0,ElementFinal0,LinhaBrancasFinal0),
	replace(LinhaBrancasFinal0,1,ElementFinal1,LinhaBrancasFinal1),
	replace(LinhaBrancasFinal1,2,ElementFinal2,LinhaBrancasFinal2),
	replace(LinhaBrancasFinal2,3,ElementFinal3,LinhaBrancasFinal3),
	replace(LinhaBrancasFinal3,4,ElementFinal4,LinhaBrancasFinal4),
	replace(LinhaBrancasFinal4,5,ElementFinal5,LinhaBrancasFinal5),
	replace(LinhaBrancasFinal5,6,ElementFinal6,LinhaBrancasFinal6),
	replace(LinhaBrancasFinal6,7,ElementFinal7,LinhaBrancasFinal7),
	get_piece(Tab, 0, 7, ElementP0),
	delMember(2,ElementP0,ElementFinalP0),
	get_piece(Tab, 1, 7, ElementP1),
	delMember(2,ElementP1,ElementFinalP1),
	get_piece(Tab, 2, 7, ElementP2),
	delMember(2,ElementP2,ElementFinalP2),
	get_piece(Tab, 3, 7, ElementP3),
	delMember(2,ElementP3,ElementFinalP3),
	get_piece(Tab, 4, 7, ElementP4),
	delMember(2,ElementP4,ElementFinalP4),
	get_piece(Tab, 5, 7, ElementP5),
	delMember(2,ElementP5,ElementFinalP5),
	get_piece(Tab, 6, 7, ElementP6),
	delMember(2,ElementP6,ElementFinalP6),
	get_piece(Tab, 7, 7, ElementP7),
	delMember(2,ElementP7,ElementFinalP7),
	get_from_board(Tab,7,LinhaPretas),
	replace(LinhaPretas,0,ElementFinalP0,LinhaPretasFinal0),
	replace(LinhaPretasFinal0,1,ElementFinalP1,LinhaPretasFinal1),
	replace(LinhaPretasFinal1,2,ElementFinalP2,LinhaPretasFinal2),
	replace(LinhaPretasFinal2,3,ElementFinalP3,LinhaPretasFinal3),
	replace(LinhaPretasFinal3,4,ElementFinalP4,LinhaPretasFinal4),
	replace(LinhaPretasFinal4,5,ElementFinalP5,LinhaPretasFinal5),
	replace(LinhaPretasFinal5,6,ElementFinalP6,LinhaPretasFinal6),
	replace(LinhaPretasFinal6,7,ElementFinalP7,LinhaPretasFinal7),
	replace(Tab,0,LinhaBrancasFinal7,AuxTab),
	replace(AuxTab,7,LinhaPretasFinal7,NewTab).

%predicado auxiliar para apagar um membro
delMember(_, [], []).
delMember(X, [X|Xs], Y) :-
    delMember(X, Xs, Y).
delMember(X, [T|Xs], [T|Y]) :-
    dif(X, T),
    delMember(X, Xs, Y).

%predicado para verificar se o jogo termina
check_winner(Tab,Player,Winner):-
	conta_pecas_tab(Tab,Player,Z),
	Z<10,
		Winner = Player;
	Winner = 0.


conta_pecas([],_X,0).
conta_pecas([X|T],X,Y):- conta_pecas(T,X,Z), Y is 1+Z.
conta_pecas([X1|T],X,Z):- X1\=X,conta_pecas(T,X,Z).

conta_pecas_linha([],_X,0).
conta_pecas_linha(Linha,X,W):-
	Linha = [First|Rest],
	conta_pecas(First,X,Z),
	conta_pecas_linha(Rest,X,W1),
	W is Z + W1.

%predicado auxiliar para contar o numero de peças de cada tipo no tabuleiro
conta_pecas_tab([],_X,0).
conta_pecas_tab(Tab,X,W):-
	Tab = [First|Rest],
	conta_pecas_linha(First,X,Z),
	conta_pecas_tab(Rest,X,W1),
	W is Z + W1.

%verifica se a stack seleccionada tem uma peça do jogador no topo
check_top_piece(Tab,Row,Column,Player,SizesTab):-
	get_piece(Tab,Row,Column,Element),
	Element = [First|_Rest],
	Player == First,
			write('Player piece is on top of the stack'),nl;
			write('Please pick a cell with one of your pieces on top of the stack!!!'),nl,nl,!,
			game_cycle(Player,Tab,1,0,SizesTab).

%Verifica se a jogada ultrapassa os limites do tabuleiro
validate_out_of_bonds(Tab,Player,NewRow,NewColumn,SizesTab):-
	NewRow>=0, NewRow=<7,
		NewColumn>=0, NewColumn=<7,
			write('Inside of the board'),nl;
			write('Please pick a destination cell inside the limits of the board'),nl,nl,!,
			game_cycle(Player,Tab,1,0,SizesTab).

%Verifica se a peça criada pela jogada ultrapassa o tamanho permitido
check_max_size(Element,Row,Column,SizesTab,Tab,Player):-
	get_piece(SizesTab,Row,Column,Element2),
	length(Element,X1),
	Element2 = [First|_Rest],
	X1=<First,
		write('Size is good'),nl;
	write('Your movement creates invalid stacks, pick a different move!'),nl,nl,!,
	game_cycle(Player,Tab,1,0,SizesTab).

%Valida as coordenadas do movimento STEP
validate_step(Row,Column,NewRow,NewColumn,Player,Tab,SizesTab):-
	Row2 = NewRow - Row,
	Column2 = NewColumn - Column,
	Row2>=0-1, Row2<2,
		Column2>=0-1, Column2<2,
			write('Valid step!'),nl;
		write('You can only move one cell when using the step movement!'),nl,nl,!,
		game_cycle(Player,Tab,1,0,SizesTab).
