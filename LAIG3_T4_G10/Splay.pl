:- use_module(library(lists)).



tab_inicial(
	[
	[[],[],[],[],[],[],[],[]],
	[[],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[]],
	[[],[0],[0],[0],[0],[0],[0],[]],
	[[],[],[],[],[],[],[],[]],
	[[],[],[],[],[],[],[],[]],
	[[],[1],[1],[1],[1],[1],[1],[]],
	[[],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[]],
	[[],[],[],[],[],[],[],[]]
	]).

jogar:-
	tab_inicial(Tabuleiro),
	gameloop(Tabuleiro,0,Novo_tabuleiro,0,0).

gameloop(Tabuleiro,Simbolo,Novo_tabuleiro,_,8):-write('Jogador 1 ganhou!!!!!').
gameloop(Tabuleiro,Simbolo,Novo_tabuleiro,8,_):-write('Jogador 1 ganhou!!!!!').
gameloop(Tabuleiro,Simbolo,Novo_tabuleiro,Capturadas_brancas,Capturadas_pretas):-
	write('Brancas:'),
	write(Capturadas_brancas),nl,
	write('Pretas:'),
	write(Capturadas_pretas),nl,
	mostra_tabuleiro(Tabuleiro),
	repeat,
	getxy(Xi,Yi),
	inbounds(Xi,Yi),
	get_linha(Tabuleiro,Yi,Linha),
	get_stack(Linha,Xi,Elemento),
	get_topo(Elemento,Topo),
	pertence_jogador(Simbolo,Topo),
	repeat,
	getcoords(Xf,Yf),
	inbounds(Xf,Yf),
	valida_input(Xi,Yi,Xf,Yf),
	get_tipo(Tipo),
	move(Tabuleiro,Xi,Yi,Xf,Yf,Tipo,Tabuleiro_move),
	muda_simbolo(Simbolo,Novo_simbolo),
	captura(Tabuleiro_move,1,Tabuleiro_intermedio1,Cb),
	captura(Tabuleiro_intermedio1,0,Tabuleiro_final,Cp),
	Capturadas_brancas1 is Capturadas_brancas+Cb,
	Capturadas_pretas1 is Capturadas_pretas+Cp,
	gameloop(Tabuleiro_final,Novo_simbolo,Novo_tabuleiro,Capturadas_brancas1,Capturadas_pretas1).

	
	

muda_simbolo(0,1).
muda_simbolo(1,0).

pertence_jogador(X,X).

pertence_jogador(X,Y):-write('Jogada invalida.'),nl,nl,false.






valida_input(Xi,Yi,Xf,Yf):-
X is Xi-Xf,
Y is Yi-Yf,
abs(X,X1),
abs(Y,Y1),
X1<2,
Y1<2.

abs(X, Y) :- X < 0, Y is -X.
	abs(X, X) :- X >= 0.
