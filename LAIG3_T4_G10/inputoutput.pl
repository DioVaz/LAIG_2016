showmenu(X):-
	nl,nl,
	write('    ------------------------   Bem vindo ao Splay!   ------------------------'),nl,nl,nl,
	write('Seleccione o tipo de jogo:'),nl,
	write(' 1. - Jogador1 vs Jogador2'),nl,
	write(' 2. - Jogador1 vs Com1'),nl,
	write(' 3. - Com1 vs Com2'),nl,nl,
	write(' 0. - Exit'),nl,nl,
	write(' Opcao: ').
	read(X).


% Interface para o utilizador escrever as coordenadas da peca que quer mover e para onde quer mover




test_read:-
	getxy(X,Y),
	write(X),
	write(Y).

getxy(X,Y):-
	write('Introduza a coordenada X da peca que quer mover: '),
	read(X), nl,
	write('Introduza a coordenada Y da peca que quer mover: '),
	read(Y), nl.

getcoords(X,Y):-
	write('Introduza a coordenada X para a qual deseja mover a peça'),
	read(X),nl,
	write('Introduza a coordenada Y para a qual deseja mover a peça'),
	read(Y),nl.

get_tipo(Tipo):-
	write('Escolha uma das opções:'),nl,
	write('Step: 0'),nl,
	write('Splay: 1'),nl,
	read(Tipo),nl.




