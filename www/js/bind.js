/* financa facil
developed by: Laio Pinheiro
laiopinheiro01@gmail.com
 */

// biblioteca para tirar o delay de click do IOS (300 milisegundos)
window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

// biblioteca para colocar mascara de moeda em inputs
$(document).ready(function(){
	$(".moeda").maskMoney({decimal:".", thousands:''});
});

//metodos das telas - BEGIN -----------------------------------------------
$(document).on('pagebeforeshow', '#pagar', function(){
    listarPagamentos();
});

$(document).on('pagebeforeshow', '#receber', function(){
    listarRecebimentos();
});

$(document).on('pagebeforeshow', '#pago', function(){
    listarPagos();
});

$(document).on('pagebeforeshow', '#recebido', function(){
    listarRecebidos();
});

$(document).on('pagebeforeshow', '#inicio', function(){
  	exibirTotalPagar();
    exibirTotalReceber();
    // exibirSaldo();

    var placeholder = $("#placeholder");
    data = retornarDadosGrafico();
    $.plot('#placeholder', data, {
        series: {
            pie: {
                show: true,
                combine: {
                    color: '#999',
                    threshold: 0.1
                }
            }
        },
        legend: {
            show: false
        }
    });
});

$(document).on('pagebeforeshow', '#exportar-pagamentos', function(){
    exportarPagamentos();
});


$(document).on('pagebeforeshow', '#exportar-recebimentos', function(){
    exportarRecebimentos();
});
//metodos das telas - END -----------------------------------------------