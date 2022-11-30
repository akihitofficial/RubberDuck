# RubberDuck

<p class="center">
  <img src="https://i.imgur.com/G1jTQ54.png">
</p>

![image](https://img.shields.io/badge/Versão-2.0.0-blue.svg?style=for-the-badge&logo=verizon)
![image](https://img.shields.io/badge/Estado-Concluído-green.svg?style=for-the-badge&logo=instatus&logoColor=white)

**RubberDuck** é um aplicativo feito para atender as necessidades comunitárias. Ele possui todas as ferramentas que um aplicativo de Flash pode oferecer, com um bônus de interação direta entre cliente e aplicativo.

### Configurando o Aplicativo
Acesse o arquivo ``configuration.json`` e faça as alterações por lá. O nome do aplicativo deve ser mantido, contudo, alterações na API devem ser feitas. Substitua o link ``example.com`` pelo que está sendo utilizado atualmente. Vá até a pasta ``GUI`` e edite o arquivo ``index.html``, editando, na WebView, os mesmos valores. Feito isso, você está pronto para compilar.

### Compilando o Aplicativo
Você precisará das ferramentas NodeJS e NPM (Node Packet Manager) para fazer isso. Com os scripts de compilação indexados, basta você utilizar eles de acordo com o sistema operacional em utilização. O tutorial segue da seguinte forma:

#### Windows
```
npm i
npm run build-win
```
Após o término da compilação, vá até a pasta **releases** e você estará pronto para fazer a distribuição.

#### Linux (WSL2)
Para fazer uma compilação no Linux você precisa ter um sistema operacional/distro baseada. Contudo, com o Windows disponibilizando mais e mais ferramentas de desenvolvimento, todos podem utilizar do **WSL2**. Primeiro, reinicie seu computador, vá até a BIOS e ative a virtualização. Após, retorne para este tutorial e siga este [link](https://learn.microsoft.com/pt-br/windows/wsl/install).

Com a distro instalada, execute os seguintes comandos:
```
sudo apt update && sudo apt -y upgrade
sudo apt install xrdp
sudo apt install -y xfce4
```
Se perguntado algo, escolha **gdm3**.
```
sudo cp /etc/xrdp/xrdp.ini /etc/xrdp/xrdp.ini.bak
sudo sed -i 's/3389/3390/g' /etc/xrdp/xrdp.ini
sudo sed -i 's/max_bpp=32/#max_bpp=32\nmax_bpp=128/g' /etc/xrdp/xrdp.ini
sudo sed -i 's/xserverbpp=24/#xserverbpp=24\nxserverbpp=128/g' /etc/xrdp/xrdp.ini
echo xfce4-session > ~/.xsession
sudo nano /etc/xrdp/startwm.sh
```
Comente as últimas duas linhas com #, depois adicione uma linha adicional contendo o seguinte: ``starxfce4``.
```
sudo /etc/init.d/xrdp start
```
Com os comandos já utilizados, vá até a barra de pesquisa do Windows e digite: **Conexão da Área Remota**. No lugar do IP, coloque: ``localhost:3390``. Depois, faça login utilizando as mesmas credenciais da sua distro.

Dentro da máquina, execute os seguintes comandos no terminal:
```
sudo apt install nodejs
sudo apt install npm
```
Baixe os arquivos do repositório e coloque na sua Área de Trabalho. Use o comando:
```
cd ~/Desktop/RubberDuck
```
Depois estes:
```
npm i
npm run build-linux
```
Após a compilação, seu aplicativo estará pronto para distribuição, localizado na pasta **releases**. Contudo, ainda é necessário com que haja um gerenciador de pacotes Debian para fazer a instalação, no qual será amplamente explicada em um guia na aba de ajuda da plataforma.

#### MacOS
Em breve.

---

### Editando o RubberDuck
O conhecimento de JavaScript, HTML e CSS é essencial. Nós utilizamos uma linguagem compilada do CSS para facilitar a integração com todos os dispositivos, chamada de Sass. É recomendado que você utilize o Visual Studio Code para testar e implementar novas funcionalidades ao RubberDuck. ElectronJS é a framework utilizada, ainda que na sua versão mais primitiva: 11.1.0, isto para conseguirmos emular o Adobe Flash Player.

#### IPC
Um IPC é um processo que acontece dentro do Electron. Para convocá-lo, nós utilizamos a constante ``IPC``. Suas funções são simples e essenciais, executando um rol de capacidades dentro do aplicativo e expandindo a sua funcionalidade. Por exemplo, eu quero que um botão me leve a um link externo. Eu utilizo do seguinte código:
```
IPC.send('openMyURL', 'https://example.com/')
```
Dentro do arquivo ``index.js``, alguém irá receptar este sinal e executar um código, sendo expressado pela função:
```
const { ipcMain, shell } = require('electron');
ipcMain.on('openMyURL', (url) => {
   shell.openExternal(url); 
});
```

Já dentro do arquivo ``index.html``, as coisas podem escalar muito mais. Utilizando do jQuery, você pode expandir estas funções a nível gráfico, visto que métodos IPC também podem ser enviados pelo ``index.js`` e recepcionados pelo primeiro. A seguinte função explica isso:

``index.js``
```
ipcMain.send('sendAjax');
```
``index.html``
```
<script>
    const { ipcRenderer } = require('electron');
    const IPC = ipcRenderer;
    const WebView = document.querySelector('WebView');
    IPC.on('sendAjax', () => {
        WebView.executeJavaScript(`
            $.ajax({
                type: "POST",
                url: "https://example/login",
                data: ${JSON.stringify($(".someForm").serializeObject())},
                dataType: "json"
            }).done(function(result) {
                console.log(JSON.stringify(result));
                location.href="https://example.com/client";
            });
        `)
    });
</script>
```
