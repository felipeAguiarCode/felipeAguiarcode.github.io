let blackJackGame = {
  "jogador"   :{'spanPontuacao':'#jogador-pontuacao','div':'#jogador-box','pontuacao':0},
  "computador":{'spanPontuacao':'#computador-pontuacao','div':'#computador-box','pontuacao':0},
  "cartas":['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
  "cartasPontos": {'2':2, '3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10, 'K':10, 'J':10,'Q':10,'A':[1,11]},
  "vitorias":0,
  "derrotas":0,
  "empates":0,
  "isStand":false, //** states de jogo */
  "turnsOver":false, //** states de jogo */
}

const JOGADOR = blackJackGame['jogador'];
const COMPUTADOR =  blackJackGame['computador'];

const audioHIT = new Audio('src/audio/swish.m4a');
const audioWIN = new Audio('src/audio/cash.mp3'); 
const audioLOSS = new Audio('src/audio/aww.mp3'); 

//listeners equivalente de adiconar o OnClick na tag
document.querySelector('#blackjack-hit-button').addEventListener('click',blackJackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click',computadorInteligencia);
document.querySelector('#blackjack-deal-button').addEventListener('click',blackJackDeal)


//registra listener para captura de botão
document.addEventListener('keyup',apertaTecla,false);

function apertaTecla(e){
  console.log(e.keyCode);

  if (e.keyCode == 49){
    blackJackHit();
  }else if(e.keyCode == 50){
    computadorInteligencia();
  }else if(e.keyCode == 51){
    blackJackDeal();
  }

}


//maneira alternativa para adicionar atalhos
//document.onkeyup=function(e){
//  var e = e || window.event; // para cobrir eventos windows do IE
//  if(e.which == 49) {
//    blackJackHit();
//  }
//}

/**
 * e.altKey && e.which == 65 = Alt + A
 * e.ctrlKey e.ctrlKey && e.keyCode == 40  = Ctrl e 1
 */

function blackJackHit(){

  if (blackJackGame['isStand'] === false){

      let cartaSelecionada  = sortearCarta();
      criarCarta(cartaSelecionada,JOGADOR);
      atualizarPontuacao(cartaSelecionada,JOGADOR);
      mostrarPontuacao(JOGADOR);

    }
}

function sortearCarta(){
  let randomIndex = Math.floor(Math.random() * blackJackGame['cartas'].length);
  return blackJackGame['cartas'][randomIndex];
}

function criarCarta(carta, jogadorAtivo){

  if(jogadorAtivo['pontuacao']<= 21){
      var cardImage = document.createElement('img');
      cardImage.src = `src/img/${carta}.png`;
      document.querySelector(jogadorAtivo['div']).appendChild(cardImage);
      audioHIT.play();
  }
}

function blackJackDeal(){
 // let vencedor =  computarVencedor();
 // mostrarResultadoFinal(vencedor);
  //mostrarResultadoFinal(computarVencedor());

  if(blackJackGame['turnsOver'] === true){

      blackJackGame['isStand'] = false;

      let imagensJogador = document.querySelector("#jogador-box").querySelectorAll('img');
      let imagensComputador = document.querySelector("#computador-box").querySelectorAll('img');

      //reseta cartas e tela
        for(i=0; i <imagensJogador.length;i++){
            imagensJogador[i].remove();
        }

        for(i=0; i <imagensComputador.length;i++){
          imagensComputador[i].remove();
      }

      //reseta pontuação
      JOGADOR['pontuacao'] = 0;
      COMPUTADOR['pontuacao'] = 0;

      document.querySelector('#jogador-pontuacao').textContent = 0;
      document.querySelector('#jogador-pontuacao').style.color = '#ffffff';

      document.querySelector('#computador-pontuacao').textContent = 0;
      document.querySelector('#computador-pontuacao').style.color = '#ffffff';

      document.querySelector('#blackjack-resultado').textContent = 'Vamos jogar';
      document.querySelector('#blackjack-resultado').style.color = 'black';

      blackJackGame['turnsOver'] = true;

  }
}

function atualizarPontuacao(carta,jogadorAtivo){
  //Se jogar sortear A e a soma o manter abaixo de 21, 
  //add 11, se não, add 1
  if(carta === 'A'){
      if (jogadorAtivo['pontuacao'] + blackJackGame['cartasPontos'][carta][1] <= 21){
          jogadorAtivo['pontuacao'] += blackJackGame['cartasPontos'] [carta][1];     
      }else{
          jogadorAtivo['pontuacao'] += blackJackGame['cartasPontos'] [carta][0];   
      }
  }else{
  jogadorAtivo['pontuacao'] += blackJackGame['cartasPontos'][carta];
  }

}

function mostrarPontuacao(jogadorAtivo){
  if (jogadorAtivo['pontuacao'] > 21){
    document.querySelector(jogadorAtivo['spanPontuacao']).textContent = 'BUST!';
    document.querySelector(jogadorAtivo['spanPontuacao']).style.color = 'red';
  }else{
  document.querySelector(jogadorAtivo['spanPontuacao']).textContent = jogadorAtivo['pontuacao'];
  }
}

function sleep (ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}



async function computadorInteligencia(){

  blackJackGame['turnsOver'] = false;
  blackJackGame['isStand'] = true;

  //condição para computador parar de sacar cartas
  while (COMPUTADOR['pontuacao'] < 16 && blackJackGame['isStand'] === true ){
    let carta = sortearCarta();
  
    criarCarta(carta,COMPUTADOR);
    atualizarPontuacao(carta,COMPUTADOR);
    mostrarPontuacao(COMPUTADOR);

    //await faz ter que esperar a função chamada
    //terminar de executar
    await sleep(1000);

  }


    
    blackJackGame['turnsOver'] = true;

    let vencedor = computarVencedor();
    mostrarResultadoFinal(vencedor);

}

//verifica quem venceu
//e atualiza tabela de resultados
function computarVencedor(){
  let vencedor;

  if (JOGADOR['pontuacao'] <= 21){
      
    /**condição: pontuação maior que a do computador ou
        quando o computador excede 21
      */

      if (JOGADOR['pontuacao']> COMPUTADOR['pontuacao'] || COMPUTADOR['pontuacao']> 21){
          
          blackJackGame['vitorias']++;
          vencedor = JOGADOR;

      }else if (JOGADOR['pontuacao'] < COMPUTADOR['pontuacao'] ){
          
          blackJackGame['derrotas']++;
          vencedor = COMPUTADOR;
      
      }else if (JOGADOR['pontuacao'] === COMPUTADOR['pontuacao']){
          blackJackGame['emaptes']++;
      
      }
  
  //quando o player excede 21 e o computador não
  }else if(JOGADOR['pontuacao'] > 21 && JOGADOR['pontuacao']<= 21){
    blackJackGame['derrotas']++;
    vencedor = COMPUTADOR;

  }else if(JOGADOR['pontuacao'] > 21 && JOGADOR['pontuacao'] > 21){
    blackJackGame['empates']++;
  }

  console.log(blackJackGame);
  return vencedor;

}

function mostrarResultadoFinal(vencedor){
  let mensagem, mensagemColor;

  if(blackJackGame['turnsOver'] === true){
  
        if(vencedor === JOGADOR){

          document.querySelector('#vitorias').textContent = blackJackGame['vitorias'];
          
          mensagem = 'Você venceu!'
          mensagemColor = 'green';

          audioWIN.play();

        }else if(vencedor === COMPUTADOR){
          
          document.querySelector('#derrotas').textContent = blackJackGame['derrotas'];

          mensagem = 'Você perdeu!'
          mensagemColor = 'red';
          
          audioLOSS.play();

        }else{

          document.querySelector('#empates').textContent = blackJackGame['empates'];

          mensagem = 'Empate!'
          mensagemColor = 'black';

        }

        document.querySelector('#blackjack-resultado').textContent = mensagem;
        document.querySelector('#blackjack-resultado').style.color = mensagemColor;
    }
}



