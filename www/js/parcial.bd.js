// ======================================================================================================================
//	Muda para a Pagina de baixa parcial levando o codigo e a tela de origem 
// ======================================================================================================================
function paginaParcial (codigo, opr) {
	$.mobile.changePage("#parcial", { transition: "pop"});
	var html = "";
	var funcaoBaixaParcial = "";
	var cancelar = "";

	if(codigo >= 0){
        funcaoBaixaParcial = "baixarParcial("+codigo+",'"+opr+"');";
		cancelar = "detalharPagamento ("+codigo+");";

		html += '<br><br><div class="ui-grid-a">';
		html += '<div class="ui-block-a"><button data-theme="b" class="link-botao" onclick="'+funcaoBaixaParcial+'">Ok</button></div>';
		html += '<div class="ui-block-b"><button data-theme="d" class="link-botao" onclick="'+cancelar+'">Cancelar</button></div>';
		html += '</div>';
               
	    $('#divparcial').html(html);
	    $('#parcial').trigger("create");
	}else{
		$.mobile.changePage("#inicio", { transition: "pop"});	
	}

}
// ======================================================================================================================
//	Efetua a baixa parcial e volta para a tela de origem
// ======================================================================================================================

function baixarParcial(codigo, opr) {
//codigo = codigo da transacao
//valor = valor que vai ser baixado
//opr = 'P' para pagar, 'R' para receber

//testando o valor - esta vindo errado
var valor = document.getElementById("valorparcial").value;

	if(valor < 0){
		alert('Digite um valor valido');
		return false;
	}

	if(opr == 'P'){ //PAGAR!
		var pagamentos = getPagamentos();
		//variaveis da nova transacao ---------------------------------------
		var cod = retornaUltimoCodPagar();
	    var titulo;
	    var comentario; 
	    var pago = 'S';
	    var datapagamento;
	    var tipo;
	    // ------------------------------------------------------------------

	    //percorre o array de pagamentos
		for(var i = 0; i < pagamentos.length; i++){
		    if(pagamentos[i].cod == codigo){
		    	//Dados da transacao original para a nova -----------------------------
		    	titulo = pagamentos[i].titulo;
		    	comentario = pagamentos[i].comentario + " - Pagamento parcial";
		    	datapagamento = retornaDataAtual();
		    	tipo = pagamentos[i].tipo;
		    	// --------------------------------------------------------------------
		    	pagamentos[i].valor = pagamentos[i].valor - valor;
		    	pagamentos[i].comentario += " - Foi pago R$"+valor+" no dia ("+retornaDataAtual()+")";
		        break;
		    }
		}

		//monta array da transacao nova
		var pagar = {
            "cod": cod,
            "titulo": titulo,
            "datapagamento": datapagamento,
            "valor": valor,
            "comentario": comentario,
            "pago": pago,
            "tipo": tipo
        };
        pagamentos.push(pagar);

        if(setPagamentos(pagamentos)){
            detalharPagamento(codigo);
        }

	}else if(opr == 'R'){//RECEBER!!
		var recebimentos = getRecebimentos();
		//variaveis da nova transacao ---------------------------------------
		var cod = retornaUltimoCodReceber();
	    var titulo;
	    var comentario; 
	    var recebido = 'S';
	    var datarecebimento;
	    // ------------------------------------------------------------------

	    //percorre o array de recebimentos
		for(var i = 0; i < recebimentos.length; i++){
		    if(recebimentos[i].cod == codigo){
		    	//Dados da transacao original para a nova -----------------------------
		    	titulo = recebimentos[i].titulo;
		    	comentario = recebimentos[i].comentario + " - Recebimento parcial";
		    	datarecebimento = retornaDataAtual();
		    	// --------------------------------------------------------------------
		    	recebimentos[i].valor = recebimentos[i].valor - valor;
		    	recebimentos[i].comentario += " - Foi recebido R$"+valor+" no dia ("+retornaDataAtual()+")";
		        break;
		    }
		}

		//monta array da transacao nova
		var receber = {
            "cod": cod,
            "titulo": titulo,
            "datarecebimento": datarecebimento,
            "valor": valor,
            "comentario": comentario,
            "recebido": recebido
        };
        recebimentos.push(receber);

        if(setRecebimentos(recebimentos)){
            detalharRecebimento(codigo);
        }

	}
}

function retornaDataAtual() {
	var data = new Date();
	var dia = data.getDate();
	var mes = data.getMonth();
	var ano = data.getFullYear();
	
	mes = colocaZero(mes);
	dia = colocaZero(dia);

	dataAtual = ano+'-'+mes+'-'+dia;

	return dataAtual;
}

// ====================================================================================================
//coloca zero na frente de numeros com 1 algarismo ====================================================
// ====================================================================================================
function colocaZero (num) {
	if(num == 1){
		num = '01';
	}else if(num == 2){
		num = '02';
	}else if(num == 3){
		num = '03';
	}else if(num == 4){
		num = '04';
	}else if(num == 5){
		num = '05';
	}else if(num == 6){
		num = '06';
	}else if(num == 7){
		num = '07';
	}else if(num == 8){
		num = '08';
	}else if(num == 9){
		num = '09';
	}

	return num;
}
