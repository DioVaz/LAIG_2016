
coloca_stack(Linha,X,Stack,Nova_linha):-
	set_element(Linha,X,Stack,Nova_linha).

substitui_linha(Tabuleiro,Y,Linha,Novo_tabuleiro):-
	set_element(Tabuleiro,Y,Linha,Novo_tabuleiro).

junta_stack(Stack1,Stack2,Nova_stack):-
	append(Stack1,Stack2,Nova_stack).

junta_stack(Tabuleiro,X1,Y1,X2,Y2,Nova_stack):-
	get_linha(Tabuleiro,Y1,Linha1_aux),
	get_stack(Linha1_aux,X1,Stack1),
	get_linha(Tabuleiro,Y2,Linha2_aux),
	get_stack(Linha2_aux,X2,Stack2),
	append(Stack1,Stack2,Nova_stack).

apaga_celula(Tabuleiro,X,Y,Novo_tabuleiro):-
	get_linha(Tabuleiro,Y,Linha),
	emptycell(Linha,X,[[]],Elemento),
	set_element(Tabuleiro,Y,Elemento,Novo_tabuleiro).

emptycell(Linha,I,E,Elemento):-
	set_element(Linha,I,E, Elemento).

get_linha(Tab,Y,Elemento):-
	Y1 is Y-1,
	get(Tab,Y1,Elemento).


get_stack(Tabuleiro,X,Y,Elemento):-
	get_linha(Tabuleiro,Y,Linha),
	get_stack(Linha,X,Elemento).


get_stack(Linha,X,Elemento):-
	X1 is X-1,
	get(Linha,X1,Elemento).

get_topo([],[]).
get_topo(Stack,Topo):-
	length(Stack,N),
	N1 is N-1,
	get(Stack,N1,Topo).

get(List,N,Elemento):-
	nth0(N,List,Elemento).

set_element([_ | T],1,E, [E|T]):-!.
set_element([H | T],I,E, [H|T2]):- I1 is I-1, set_element(T, I1, E,T2).

pertence_jogador(Tabuleiro,X,Y,Simbolo) :-  get_linha(Tabuleiro,X,Linha),
											get_stack(Linha,Y,Stack),
											get_topo(Stack,Topo),
										 	Simbolo=Topo.

nova_posicao(Xi,Yi,Xm,Ym,Xf,Yf):-
	Xf is Xi+Xm,
	Yf is Yi+Ym.



