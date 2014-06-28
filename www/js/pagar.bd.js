/* financa facil
developed by: Laio Pinheiro
laiopinheiro01@gmail.com
 */

// =======================================================================================================
// Cadastra um novo pagamento 
// =======================================================================================================
function salvarNovoPagar() {

    if(verificaCamposPagar()){    
        var $cod = retornaUltimoCodPagar();
        var $titulo = document.getElementById("titulopagar");
        var $valor = document.getElementById("valorpagar"); 
        var $comentario = document.getElementById("comentariopagar"); 
        var $pago = "N";
        var $datapagamento = document.getElementById("data-pagamento").value;
        var $tipo = document.getElementById("tipopagamento").value;
        
        if ($tipo == ""){
            $tipo = "outro";
        }

        var pagar = {
            "cod": $cod,
            "titulo": $titulo.value,
            "datapagamento": $datapagamento,
            "valor": $valor.value,
            "comentario": $comentario.value,
            "pago": $pago,
            "tipo": $tipo
        };

        var pagamentos = getPagamentos();
        pagamentos.push(pagar);
        if(setPagamentos(pagamentos)){
            $cod.value = 0;
            $titulo.value = "";
            $datapagamento.value = "";
            $valor.value = "";
            $comentario.value = "";
            $.mobile.changePage( "#pagar", { transition: "pop", reverse: true});
        }
    }

}
// =======================================================================================================
// Traz o array de pagamentos
// =======================================================================================================
function getPagamentos() {
    if (!localStorage["pagamentos"])
	   localStorage["pagamentos"] = JSON.stringify([]);

    return JSON.parse(localStorage["pagamentos"]);
}
// =======================================================================================================
// Grava o array com os pagamentos
// =======================================================================================================
function setPagamentos($pagamentos) {
    $pagamentos.sort(function (a, b) {
        return parseInt((a.datapagamento.replace("-", "")).replace("-", "")) - parseInt((b.datapagamento.replace("-", "")).replace("-", ""));
    });
    if(localStorage["pagamentos"] = JSON.stringify($pagamentos)){
        return true;
    }else{
        return false;
    }
}
// =======================================================================================================
// Retorna o ultimo codigo cadastrado mais 1, para novo pagamento
// =======================================================================================================
function retornaUltimoCodPagar() {
    var $pagamentos = getPagamentos();
    var $ultimoCod = -1;
    var $codaux;
    if (localStorage["pagamentos"]){
        for(var i = 0; i < $pagamentos.length; i++){
            $codaux = $pagamentos[i].cod;
            if($codaux > $ultimoCod){
                $ultimoCod = $codaux;
            }
        }
    }
    return $ultimoCod + 1;
}
// =======================================================================================================
// Faz a verificacao se todos os campos foram preenchidos na tela de cadastro do pagamento
// =======================================================================================================
function verificaCamposPagar () {
    $titulo = document.getElementById("titulopagar");
    $valor = document.getElementById("valorpagar");

    if($titulo.value == ''){
        alert('Titulo é obrigatorio');
        return false;
    }else if($valor.value == ''){
        alert('Valor é obrigatorio');
        return false;
    }else{
        return true;
    }
}
// =======================================================================================================
// Lista o que falta pagar
// =======================================================================================================
function listarPagamentos() {
    var $pagamentos = getPagamentos();
    var $listaPagar = $("#lista-pagar");
    var $lista = "";
    $($listaPagar).html('<li data-theme="b">Para adicionar contas a pagar<br> pressione o botão "novo" acima.</li>');

    if(getTotalPagamentos('N') != 0){
        for(var i = 0; i < $pagamentos.length; i++){
            if($pagamentos[i].pago == 'N'){                   
                $lista +='<li data-theme="c"><a class="link-lista" onclick="detalharPagamento('+$pagamentos[i].cod+')">';
                $lista +=  '<span style="font-size:18px;">'+ $pagamentos[i].titulo +'</span><br>'+ $pagamentos[i].datapagamento +' - R$ <span style="color:red;">'+ $pagamentos[i].valor +'</span>';
                $lista += "</a><hr></li>";
            }
        }
        if($($listaPagar).html($lista)){
            $("#lista-pagar").listview("refresh");
        }
    }
    $("#lista-pagar").listview("refresh");
}
// =======================================================================================================
// Retorna o total(soma) dos pagamentos
// =======================================================================================================
function getTotalPagamentos ($tipo) {
    //Parametro: 'S'= pago 'N'= á pagar
    var $pagamentos = getPagamentos();
    var $total = 0;

    for(var i = 0; i < $pagamentos.length; i++){
        if($pagamentos[i].pago == $tipo){
            $total += parseInt($pagamentos[i].valor*100);
        }
    }
    return $total/100;
}
// =======================================================================================================
// Detalha o que falta pagar
// =======================================================================================================
function detalharPagamento ($codigoPagamento) {
    $.mobile.changePage("#detalhe-pagar", { transition: "pop"});

    var $pagamentos = getPagamentos();
    var $detalhe = $("#divdetalhepagar");
    var $html = "";
    var pagarparcial = "";

    for(var i = 0; i < $pagamentos.length; i++){
            if($pagamentos[i].cod == $codigoPagamento){
                pagarparcial = "paginaParcial('"+$pagamentos[i].cod+"', 'P');";

                $html += '<span style="font-size:28px">'+$pagamentos[i].titulo+'</span><br><br>';
                $html += '<span style="font-size:24px">- Valor: </span><span style="font-size:20px; color: grey"> R$ '+$pagamentos[i].valor+'</span><br><br>';
                if($pagamentos[i].datapagamento != ""){
                    $html += '<span style="font-size:24px">- Data do Pagamento: </span><br><span style="font-size:20px; color: grey">'+$pagamentos[i].datapagamento+'</span><br><br>';                    
                }
                if($pagamentos[i].comentario != ""){
                    $html += '<span style="font-size:24px">- Comentario: </span><br><span style="font-size:20px; color: grey">'+$pagamentos[i].comentario+'</span><br><br>';                    
                }
                $html += '<br><br><button data-theme="b" class="link-botao" onclick="mudarStatusPagamento('+$pagamentos[i].cod+');">Pagar</button>';
                $html += '<div class="ui-grid-a"><div class="ui-block-a"><button data-theme="b" class="link-botao" onclick="'+pagarparcial+'">PG parcial</button></div>';
                $html += '<div class="ui-block-b"><button data-theme="d" class="link-botao" onclick="deletarPagamento('+$pagamentos[i].cod+');">Excluir</button></div></div>';
                break;
            }
    }
    $($detalhe).html($html);
    $('#detalhe-pagar').trigger("create");
}
// =======================================================================================================
// Muda o status do pagamento - 'S' = pago | 'N' = nao pago
// =======================================================================================================
function mudarStatusPagamento ($codigoPagamento) {
    var $pagamentos = getPagamentos();
    var $hash = location.hash;
    for(var i = 0; i < $pagamentos.length; i++){                   
            if($pagamentos[i].cod == $codigoPagamento){
                if($pagamentos[i].pago == 'S'){
                    $pagamentos[i].pago = 'N';
                    break; 
                }else if($pagamentos[i].pago == 'N'){
                    $pagamentos[i].pago = 'S';
                    break; 
                }
            }
    }
    if(setPagamentos($pagamentos)){
        if($hash == "#detalhe-pagar"){
            if($.mobile.changePage("#pagar", { transition: "pop"})){
                listarPagamentos();
            }
        }else if($hash == "#detalhe-pago"){
            if($.mobile.changePage("#pago", { transition: "pop"})){
                listarPagos();
            }
        }
    }
}
// =======================================================================================================
// Deleta um pagamento
// =======================================================================================================
function deletarPagamento ($codigoPagamento) {
    var $pagamentos = getPagamentos();
    var $hash = location.hash;

    for(var i = 0; i < $pagamentos.length; i++){                   
            if($pagamentos[i].cod == $codigoPagamento){
                $pagamentos.splice(i,1);
                break;
            }
    }

    if(setPagamentos($pagamentos)){
        if($hash == "#detalhe-pagar"){
            $.mobile.changePage("#pagar", { transition: "pop"});
        }else if($hash == "#detalhe-pago"){
            $.mobile.changePage("#pago", { transition: "pop"});
        }
    }

}
// =======================================================================================================
// Lista o que ja foi pago
// =======================================================================================================
function listarPagos() {
    var $pagamentos = getPagamentos();
    var $listaPagar = $("#lista-pagos");
    var $lista = "";
    $($listaPagar).html('<li>- Aqui fica listado o que você já pagou.<br><br>- Adicione pagamentos na opção "Não Paguei".</li>');

    if(getTotalPagamentos('S') != 0){
        for(var i = 0; i < $pagamentos.length; i++){
            if($pagamentos[i].pago == 'S'){              
                $lista +='<li data-theme="c"><a class="link-lista" onclick="detalharPagos('+$pagamentos[i].cod+')">';
                $lista += '<span style="font-size:18px;">'+ $pagamentos[i].titulo +'</span><br>'+ $pagamentos[i].datapagamento +' - R$'+ $pagamentos[i].valor;
                $lista += "</a><hr></li>";
            }
        }
        if($($listaPagar).html($lista)){
            $("#lista-pagos").listview("refresh");
        }
    }
    $("#lista-pagos").listview("refresh");
}
// =======================================================================================================
// Detalha o que ja foi pago
// =======================================================================================================
function detalharPagos ($codigoPagamento) {
    $.mobile.changePage("#detalhe-pago", { transition: "pop"});

    var $pagamentos = getPagamentos();
    var $detalhe = $("#divdetalhepago");
    var $html = "";

    for(var i = 0; i < $pagamentos.length; i++){                   
            if($pagamentos[i].cod == $codigoPagamento){
                $html += '<span style="font-size:28px">'+$pagamentos[i].titulo+'</span><br><br>';
                $html += '<span style="font-size:24px">- Valor: </span><span style="font-size:20px; color: grey">R$ '+$pagamentos[i].valor+'</span><br><br>';
                $html += '<span style="font-size:24px">- Data do Pagamento: </span><br><span style="font-size:20px; color: grey">'+$pagamentos[i].datapagamento+'</span><br><br>';
                $html += '<span style="font-size:24px">- Comentario: </span><br><span style="font-size:20px; color: grey">'+$pagamentos[i].comentario+'</span><br><br>';
                $html += '<div class="ui-grid-a"><div class="ui-block-a"><button data-theme="b" class="link-botao" onclick="mudarStatusPagamento('+$pagamentos[i].cod+');">Não Paguei</button></div>';
                $html += '<div class="ui-block-b"><button data-theme="d" class="link-botao" onclick="deletarPagamento('+$pagamentos[i].cod+');">Excluir</button></div></div>';
            }
    }
    $($detalhe).html($html);
    $('#detalhe-pago').trigger("create");
}