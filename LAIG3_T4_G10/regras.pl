

captura(Tabuleiro,Simbolo,Novo_tabuleiro,Capturadas):-
	get_y(Simbolo,Y),
	get_linha(Tabuleiro,Y,Linha),
	capture_aux(Linha,Linha,Simbolo,1,Nova_linha),
	get_capturadas(Linha,Nova_linha,Capturadas),
	substitui_linha(Tabuleiro,Y,Nova_linha,Novo_tabuleiro).


capture_aux([],Ret_linha,_,_,Ret_linha).
capture_aux([H|T],Linha,Simbolo,X,Ret_linha):-
		retira_pecas(H,Simbolo,New_stack),
		coloca_stack(Linha,X,New_stack,Nova_linha),
		X1 is X+1,
		capture_aux(T,Nova_linha,Simbolo,X1,Ret_linha).



get_capturadas(Linha1,Linha2,Diferenca):-
	conta_pecas(Linha1,0,N1),
	conta_pecas(Linha2,0,N2),
	Diferenca is N1-N2.



conta_pecas([],Contador_ret,Contador_ret).
conta_pecas([H|T],Contador,Contador_ret):-
length(H,N),
Contador_aux is Contador+N,
conta_pecas(T,Contador_aux,Contador_ret).

retira_pecas(Stack,Peca,New_stack):-
	length(Stack,N1),
	delete(Stack,Peca,New_stack),
	length(New_stack,N2).

get_y(0,1).
get_y(1,8).



splay_ilegal([],_).
splay_ilegal([H|T],Y):-
	testa_linha(H,1,Y),
	Y1 is Y+1,
	splay_ilegal(T,Y1).


testa_linha([[]],_,_).
testa_linha([H|T],X,Y):-
	testa_stack(H,X,Y),
	X1 is X+1,
	testa_linha(T,X1,Y).


testa_stack(Stack,X,Y):-
	length(Stack,N),
	borda_oeste(X,N),
	borda_este(X,N),
	borda_sul(Y,N),
	borda_norte(Y,N).



borda_oeste(X,Tamanho):-
X1 is X-Tamanho,
X1>0.

borda_este(X,Tamanho):-
X1 is X+Tamanho,
X1<9.

borda_norte(Y,Tamanho):-
Y1 is Y-Tamanho,
Y1>0.

borda_sul(Y,Tamanho):-
Y1 is Y+Tamanho,
Y1<9.



inbounds(X,Y):-
	X > 0,
	X < 9,
	Y < 9,
	Y > 0.