/* financa facil
developed by: Laio Pinheiro
laiopinheiro01@gmail.com
 */

// =======================================================================================================
// Cadastra um novo recebimento 
// =======================================================================================================
function salvarNovoReceber() {

    if(verificaCamposReceber()){    
        var $cod = retornaUltimoCodReceber();
        var $titulo = document.getElementById("tituloreceber");
        var $valor = document.getElementById("valorreceber"); 
        var $comentario = document.getElementById("comentarioreceber"); 
        var $recebido = "N";
        var $datarecebimento = document.getElementById("data-recebimento").value;

        var receber = {
            "cod": $cod,
            "titulo": $titulo.value,
            "datarecebimento": $datarecebimento,
            "valor": $valor.value,
            "comentario": $comentario.value,
            "recebido": $recebido
        };

        var recebimentos = getRecebimentos();
        recebimentos.push(receber);
        if(setRecebimentos(recebimentos)){
            $cod.value = 0;
            $titulo.value = "";
            $datarecebimento.value = "";
            $valor.value = "";
            $comentario.value = "";
            $.mobile.changePage( "#receber", { transition: "pop", reverse: true});
        }
    }

}
// =======================================================================================================
// Traz o array de recebimentos
// =======================================================================================================
function getRecebimentos() {
    if (!localStorage["recebimentos"])
       localStorage["recebimentos"] = JSON.stringify([]);

    return JSON.parse(localStorage["recebimentos"]);

}
// =======================================================================================================
// Grava o array de recebimentos
// =======================================================================================================
function setRecebimentos($recebimentos) {
    $recebimentos.sort(function (a, b) {
        return parseInt((a.datarecebimento.replace("-", "")).replace("-", "")) - parseInt((b.datarecebimento.replace("-", "")).replace("-", ""));
    });
    if(localStorage["recebimentos"] = JSON.stringify($recebimentos)){
        return true;
    }else{
        return false;
    }
}
// =======================================================================================================
// Retorna o ultimo codigo cadastrado mais 1, para novo recebimento
// =======================================================================================================
function retornaUltimoCodReceber() {
    var $recebimentos = getRecebimentos();
    var $ultimoCod = -1;
    var $codaux;
    if (localStorage["recebimentos"]){
        for(var i = 0; i < $recebimentos.length; i++){
            $codaux = $recebimentos[i].cod;
            if($codaux > $ultimoCod){
                $ultimoCod = $codaux;
            }
        }
    }
    return $ultimoCod + 1;
}
// =======================================================================================================
// Faz a verificacao se todos os campos foram preenchidos na tela de cadastro do recebimento
// =======================================================================================================
function verificaCamposReceber () {
    $titulo = document.getElementById("tituloreceber");
    $valor = document.getElementById("valorreceber");

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
// lista o que nao foi recebido
// =======================================================================================================
function listarRecebimentos() {
    var $recebimentos = getRecebimentos();
    var $listaReceber = $("#lista-receber");
    var $lista = "";
    $($listaReceber).html('<li data-theme="a">Para adicionar valores a receber<br> pressione o botão "novo" acima.</li>');

    if(getTotalRecebimentos('N') != 0){
        for(var i = 0; i < $recebimentos.length; i++){
            if($recebimentos[i].recebido == 'N'){                   
                $lista +='<li data-theme="c"><a class="link-lista" onclick="detalharRecebimento('+$recebimentos[i].cod+')">';
                $lista +=  '<span style="font-size:18px;">'+ $recebimentos[i].titulo +'</span><br>'+$recebimentos[i].datarecebimento+' - R$ <span style="color:green;">'+ $recebimentos[i].valor +'</span>';
                $lista += "</a><hr></li>";
            }
        }
        if($($listaReceber).html($lista)){
            $("#lista-receber").listview("refresh");
        }
    }
    $("#lista-receber").listview("refresh");
}
// =======================================================================================================
// Retorna o total(soma) dos recebimentos
// =======================================================================================================
function getTotalRecebimentos ($tipo) {
    //Parametro: 'S'= pago 'N'= á pagar
    var $recebimentos = getRecebimentos();
    var $total = 0;

    for(var i = 0; i < $recebimentos.length; i++){
        if($recebimentos[i].recebido == $tipo){
            $total += parseInt($recebimentos[i].valor*100);
        }
    }
    return $total/100;
}
// =======================================================================================================
// Detalha o que nao foi recebido
// =======================================================================================================
function detalharRecebimento ($codigoRecebimento) {
    $.mobile.changePage("#detalhe-receber", { transition: "pop"});

    var $recebimentos = getRecebimentos();
    var $detalhe = $("#divdetalhereceber");
    var $html = "";
    var receberparcial = "";

    for(var i = 0; i < $recebimentos.length; i++){                   
            if($recebimentos[i].cod == $codigoRecebimento){
                receberparcial = "paginaParcial('"+$recebimentos[i].cod+"', 'R');";

                $html += '<span style="font-size:28px">'+$recebimentos[i].titulo+'</span><br><br>';
                $html += '<span style="font-size:24px">- Valor: </span><span style="font-size:20px; color: grey"> R$ '+$recebimentos[i].valor+'</span><br><br>';
                if($recebimentos[i].datarecebimento != ""){
                    $html += '<span style="font-size:24px">- Data do recebimento: </span><br><span style="font-size:20px; color: grey">'+$recebimentos[i].datarecebimento+'</span><br><br>';
                }
                if($recebimentos[i].comentario != ""){
                    $html += '<span style="font-size:24px">- Comentario: </span><br><span style="font-size:20px; color: grey">'+$recebimentos[i].comentario+'</span><br><br>';                    
                }
                $html += '<br><br><button data-theme="b" class="link-botao" onclick="mudarStatusRecebimento('+$recebimentos[i].cod+');">Receber</button>';
                $html += '<div class="ui-grid-a"><div class="ui-block-a"><button data-theme="b" class="link-botao" onclick="'+receberparcial+'">RC parcial</button></div>';
                $html += '<div class="ui-block-b"><button data-theme="d" class="link-botao" onclick="deletarRecebimento('+$recebimentos[i].cod+');">Excluir</button></div></div>';
            }
    }
    $($detalhe).html($html);
    $('#detalhe-receber').trigger("create");
}
// =======================================================================================================
// Muda o status do recebimento - 'S' = Recebido | 'N' = nao recebido
// =======================================================================================================
function mudarStatusRecebimento ($codigoRecebimento) {
    var $recebimentos = getRecebimentos();
    var $hash = location.hash;
    for(var i = 0; i < $recebimentos.length; i++){                   
            if($recebimentos[i].cod == $codigoRecebimento){
                if($recebimentos[i].recebido == 'S'){
                    $recebimentos[i].recebido = 'N';
                    break; 
                }else if($recebimentos[i].recebido == 'N'){
                    $recebimentos[i].recebido = 'S';
                    break; 
                }
            }
    }
    if(setRecebimentos($recebimentos)){
        if($hash == "#detalhe-receber"){
            if($.mobile.changePage("#receber", { transition: "pop"})){
                listarRecebimentos();
            }
        }else if($hash == "#detalhe-recebido"){
            if($.mobile.changePage("#recebido", { transition: "pop"})){
                listarRecebidos();
            }
        }
    }
}
// =======================================================================================================
// Deleta um recebimento
// =======================================================================================================
function deletarRecebimento ($codigoRecebimento) {
    var $recebimentos = getRecebimentos();
    var $hash = location.hash;

    for(var i = 0; i < $recebimentos.length; i++){                   
            if($recebimentos[i].cod == $codigoRecebimento){
                $recebimentos.splice(i,1);
                break;
            }
    }

    if(setRecebimentos($recebimentos)){
        if($hash == "#detalhe-receber"){
            $.mobile.changePage("#receber", { transition: "pop"});
        }else if($hash == "#detalhe-recebido"){
            $.mobile.changePage("#recebido", { transition: "pop"});
        }
    }

}
// =======================================================================================================
// Lista o que ja foi pago
// =======================================================================================================
function listarRecebidos() {
    var $recebimentos = getRecebimentos();
    var $listaReceber = $("#lista-recebidos");
    var $lista = "";
    $($listaReceber).html('<li>- Aqui fica listado o que você já recebeu.<br><br>- Adicione recebimentos na opção "Não Recebi".</li>');

    if(getTotalRecebimentos('S') != 0){
        for(var i = 0; i < $recebimentos.length; i++){
            if($recebimentos[i].recebido == 'S'){              
                $lista +='<li data-theme="c"><a class="link-lista" onclick="detalharRecebidos('+$recebimentos[i].cod+')">';
                $lista += '<span style="font-size:18px;">'+ $recebimentos[i].titulo +'</span><br>'+$recebimentos[i].datarecebimento+' - R$'+ $recebimentos[i].valor;
                $lista += "</a><hr></li>";
            }
        }
        if($($listaReceber).html($lista)){
            $("#lista-recebidos").listview("refresh");
        }
    }
    $("#lista-recebidos").listview("refresh");
}
// =======================================================================================================
// Detalha o que ja foi recebido
// =======================================================================================================
function detalharRecebidos ($codigoRecebimento) {
    if($.mobile.changePage("#detalhe-recebido", { transition: "pop"}));
    //window.location.hash="detalhe-recebido";
    var $recebimentos = getRecebimentos();
    var $detalhe = $("#divdetalherecebido");
    var $html = "";

    for(var i = 0; i < $recebimentos.length; i++){                 
            if($recebimentos[i].cod == $codigoRecebimento){
                $html += '<span style="font-size:28px">'+$recebimentos[i].titulo+'</span><br><br>';
                $html += '<span style="font-size:24px">- Valor: </span><span style="font-size:20px; color:grey">R$ '+$recebimentos[i].valor+'</span><br><br>';
                $html += '<span style="font-size:24px">- Data do recebimento: </span><br><span style="font-size:20px; color:grey">'+$recebimentos[i].datarecebimento+'</span><br><br>';
                $html += '<span style="font-size:24px">- Comentario: </span><br><span style="font-size:20px; color:grey">'+$recebimentos[i].comentario+'</span><br><br>';
                $html += '<div class="ui-grid-a"><div class="ui-block-a"><button data-theme="b" class="link-botao" onclick="mudarStatusRecebimento('+$recebimentos[i].cod+');">Não Recebi</button></div>';
                $html += '<div class="ui-block-b"><button data-theme="d" class="link-botao" onclick="deletarRecebimento('+$recebimentos[i].cod+');">Excluir</button></div></div>';
            }
    }
    $($detalhe).html($html);
    $('#detalhe-recebido').trigger("create");  
}