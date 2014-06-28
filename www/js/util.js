
//preenche o campo de total a pagar da tela inicial
function exibirTotalPagar () {
    var $total = document.getElementById("totalpagar"); 
    $total.value = "R$ "+ (getTotalPagamentos('N'));
}

//preenche o campo de total a receber da tela inicial
function exibirTotalReceber () {
    var $total = document.getElementById("totalreceber"); 
    $total.value = "R$ "+ (getTotalRecebimentos('N'));
}

//preenche o campo de saldo da tela inicial
function exibirSaldo () {
    var $saldo = document.getElementById("saldo"); 
    var $pagamentos = getTotalPagamentos('S');
    var $recebimentos = getTotalRecebimentos('S');

    $saldo.value = "R$ "+ (($recebimentos - $pagamentos));
}

//recebe uma data em padrao americano e retorna em brasileiro e com o mes por extenso
function exibirDataComMesExtenso (data) {
    
}

//exibe o json de pagamentos para exportar
function exportarPagamentos () {
	pagamentos = JSON.stringify(getPagamentos());
	$('#div-exportar-pagamentos').html(pagamentos);
}

//exibe o json de recebimentos para exportar
function exportarRecebimentos () {
	recebimentos = JSON.stringify(getRecebimentos());
	$('#div-exportar-recebimentos').html(recebimentos);
}

//Monta os dados para o grafico
function retornarDadosGrafico () {
    var data = [
        { label: "Series1",  data: 10},
        { label: "Series2",  data: 30},
        { label: "Series3",  data: 90},
        { label: "Series4",  data: 70},
        { label: "Series5",  data: 80},
        { label: "Series6",  data: 110}
    ];

    return data;
}