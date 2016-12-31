




mostra_tabuleiro(Tab) :- espaco,
						 write(' '),
						 topo,nl,
						 mostra_linhas(Tab).

mostra_linhas([]).
mostra_linhas([Linha|Tabuleiro]) :- espaco,
									mostra_linha(Linha,Linha,4),
									base_celula,nl,
									mostra_linhas(Tabuleiro).



mostra_linha(Linha,Linha,0).
mostra_linha([],Linha,N) :-  write('|'),nl,
							 N1 is N-1,
							 espaco,
							 mostra_linha(Linha,Linha,N1).
mostra_linha([Head|Tail],Linha,N) :- write('|'),
									 mostra_peca(Head,N),
									 N1 is N+4,
									 mostra_peca(Head,N1),
									 mostra_linha(Tail,Linha,N).
									

mostra_peca([],N) :- nth_membro(N,Peca,Caracter),desenha(Caracter).
mostra_peca(Peca,N) :- nth_membro(N,Peca,Caracter),desenha(Caracter).


desenha(' ') :- write(' ').
desenha(0)  :-  write('0').
desenha(1)  :-  write('X').

nth_membro(_,[],' ').
nth_membro(1,[M|_],M).
nth_membro(N,[_|T],M) :- N1 is N-1,
						 nth_membro(N1,T,M).

topo :- write('________________________').
base_celula :- write('|__|__|__|__|__|__|__|__|').
espaco :- write('                               ').