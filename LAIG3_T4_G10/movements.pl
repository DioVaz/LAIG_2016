


test_step:-
tab_inicial(Tab),
step(Tab,6,2,7,2,X),
mostra_tabuleiro(X).

step(Tabuleiro,Xi,Yi,Xf,Yf,Novo_tabuleiro):-
	junta_stack(Tabuleiro,Xi,Yi,Xf,Yf,Nova_stack),
	apaga_celula(Tabuleiro,Xi,Yi,Tabuleiro_intermedio),
	get_linha(Tabuleiro_intermedio,Yf,Linha),
	coloca_stack(Linha,Xf,Nova_stack,Nova_linha),
	substitui_linha(Tabuleiro_intermedio,Yf,Nova_linha,Novo_tabuleiro).

	


splay(Tabuleiro,Xi,Yi,Xf,Yf,Novo_tabuleiro):-
	get_linha(Tabuleiro,Yi,Elemento),
	get_stack(Elemento,Xi,Stack),
	reverse(Stack,New_stack),
	apaga_celula(Tabuleiro,Xi,Yi,Tabuleiro_intermedio),
	calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym),
	splay_aux(Tabuleiro_intermedio,Xi,Yi,Xm,Ym,New_stack,Novo_tabuleiro).


splay_aux(Ret_tabuleiro,Xi,Yi,Xd,Yd,[],Ret_tabuleiro).
splay_aux(Tabuleiro,Xi,Yi,Xd,Yd,[H|Tail],Ret_tabuleiro):-
	X is Xi+Xd,
	Y is Yi+Yd,
	get_linha(Tabuleiro,Y,Linha),
	get_stack(Linha,X,Stack),
	junta_stack(Stack,[H],Nova_stack),
	coloca_stack(Linha,X,Nova_stack,Nova_linha),
	substitui_linha(Tabuleiro,Y,Nova_linha,Novo_tabuleiro),
	splay_aux(Novo_tabuleiro,X,Y,Xd,Yd,Tail,Ret_tabuleiro).



test_move:-
tab_inicial(X),
move(X,2,2,3,3,1,X1),
mostra_tabuleiro(X1).

move(Tabuleiro,Xi,Yi,Xf,Yf,1,Novo_tabuleiro):-
	splay(Tabuleiro,Xi,Yi,Xf,Yf,Novo_tabuleiro).

move(Tabuleiro,Xi,Yi,Xf,Yf,0,Novo_tabuleiro):-
	step(Tabuleiro,Xi,Yi,Xf,Yf,Novo_tabuleiro).


calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf>Xi,Yf=Yi, Xm is 1, Ym is 0.  %% E
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf>Xi,Yf>Yi, Xm is 1, Ym is 1.  %% SE
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf=Xi,Yf>Yi, Xm is 0, Ym is 1.  %% S
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf<Xi,Yf>Yi, Xm is -1, Ym is 1. %% SO
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf<Xi,Yf=Yi, Xm is -1, Ym is 0. %% O
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf<Xi,Yf<Yi, Xm is -1, Ym is -1. %% NO
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf=Xi,Yf<Yi, Xm is 0, Ym is -1.  %% N
calcula_direcao(Xi,Yi,Xf,Yf,Xm,Ym) :- Xf>Xi,Yf<Yi, Xm is 1, Ym is -1. %% NE


test:-
tab_inicial(X),
get_linha(X,2,Y),
write(Y).



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

get_y(0,8).
get_y(1,1).



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