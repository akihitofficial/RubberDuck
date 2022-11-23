# Zeus

![image](https://img.shields.io/badge/Versão-0.0.0-blue.svg?style=for-the-badge&logo=verizon)
![image](https://img.shields.io/badge/Estado-Revisão-yellow.svg?style=for-the-badge&logo=instatus&logoColor=white)
![image](https://img.shields.io/badge/Java-8-red.svg?style=for-the-badge&logo=java&logoColor=white)

**Zeus** é a denominação do projeto que sucede **Hera**, o servidor de alta performance criado por [@oraphaleao](https://github.com/oraphaleao). O intuito do projeto é dar prosseguimento ao emulador Habbo, ampliando a API original do **Comet** criada e mantida até pouco tempo atrás por [@LeonHartley](https://github.com/LeonHartley) para ter maior assimilação ao produto original. O código roda, atualmente, no **JRE/JDK** (_Java Runtime Environment_; _Java Development Kit_) **1.8**.

### Compilando o Emulador
Você _deve_ utilizar o IntelliJ para compilar o emulador. Além dele contar com uma interface mais amigável que a IDE Eclipse, ele abre margem para a troca instantânea da JDK através do Maven. Em caso de você estar perdido, basta seguir a seguinte linha de comando:
``File`` ``Project Structure`` ``+`` ``C:/path/to/jdk1.8.0`` ``JDK`` ``+`` ``C:/path/to/jdk1.8.0/lib/tools.jar``

#### Coerce
Para instalar o [Coerce](https://github.com/LeonHartley/Coerce) como dependência, basta baixá-lo e abri-lo com o IntelliJ. Feito isso, ao invés de clicar em ``package``, você irá clicar no botão ``install``. Após a compilação, ele estará disponível para ser utilizado como dependência — possibilitando com que o Zeus seja compilado sem problema algum.

---

Feito todo o passo a passo, prossiga com a mudança definitiva da versão do _Development Kit_. Na indexação, faça a ressincronização do Maven clicando no símbolo de recarregar ao passar o mouse por cima do ícone do compilador. Agora, clique em ``package`` e ignore avisos acerca de pacotes desatualizados, afinal eles virão futuramente para o projeto através de Atualizações de Segurança[^1].

### Ligando o Emulador
0. Copie as pastas ``config``, ``configuration`` e ``lib`` (localizada dentro do ``target`` no Zeus-Server) para outro lugar.
1. Copie o arquivo ``Zeus-Server-0.0.0-STABLE.jar`` para o mesmo lugar que as pastas anteriormente mencionadas.
2. Configure a conexão ao seu banco de dados dentro da pasta ``config`` mexendo no arquivo ``zeus.properties``.
3. Crie um arquivo chamado ``run.bat`` e clique com o botão direito para _Editar_.
4. Escolha uma das opções abaixo para ligar o Zeus:

#### _Java 8 PATH_
```
java8 -jar -Dfile.encoding=UTF-8 Zeus-Server-0.0.0-STABLE.jar
```
#### _Java 8 Directory Pointing_
```
"path/to/jre1.8.0/bin/java.exe" -Dfile.encoding=UTF-8 -jar Zeus-Server-0.0.0-STABLE.jar
```

# Arquivos
O Zeus, assim como seu antecessor espiritual, o Comet, possui um arquivo chamado ``version.bat`` que serve para _checar_ a versão do Maven instalada no sistema. Por isso, antes de executá-lo, é necessário tê-lo instalado. Ele também inclui um pacote de ferramentas[^2] que pode ser utilizado para complementar a experiência de desenvolvimento.

# Lista
No decorrer do projeto, é estimado com que esta lista esteja completa. As que forem cumpridas e não precisarem de nenhuma refatoração futura estarão sendo marcadas com um :tada:.
- [ ] Refatoração do Código
- [x] Correção dos Comandos Antigos :tada:
- [ ] Códigos dos WIREDs
- [ ] Integração Universal dos Websockets
- [ ] API de Avatares Universal
- [ ] Atualização de Dependências
- [ ] Programação do SnowStorm
- [ ] Adição de novos Comandos e WIREDs
- [ ] _Graphical User Interface_
- [ ] Integração de Novas Mecânicas[^3]

# Ofuscação de Origem 
Método de boot a ser utilizado ofuscando a origem dos códigos _Zeus_[^4]. Como o projeto se tratará de um _closed-source_, é necessário com que boa parte do código seja ofuscado ou escondido para com que não hajam problemas do tipo _broken pipeline_ ou _FTP_[^5]. O __código abaixo__ representa o pulso **on**. Para desligar, basta apertar as teclas ``CTRL+C`` para terminar o software — utilizado, geralmente, também, para neutralizar ações do Prompt de Comando em lotes.

```java
package com.boot;

import com.olympus.server.boot.Zeus;
import com.google.common.collect.Maps;

import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Zeus.run(args);
    }
}
```

[^1]: Uma das últimas atualizações de código que pretendemos é a de atualização de pacotes. Há uma grande chance deles virem visto que os ataques de hotéis retrôs, ultimamente, têm sido muito mais poderosos do que o que estávamos acostumados.
[^2]: A pasta Tools possui uma interface em WebApp com um socket e funções remotas simples. Ela pode ser consultada para ver as estatísticas do Emulador em tempo real e realizar outras funções sem a necessidade de estar in-game.
[^3]: Exemplos de mecânica: Duas jaquetas. Armário com Múltiplas Páginas. Sistema de Rolagem de Dados. Moeda personalizada. Gerenciamento de planilhas através do banco de dados entre outros.
[^4]: O projeto é fechado, portanto, ter discrição na produção é essencial. Além disso, fornece segurança e possibilita com que chaves RSA, utilizadas pelo Habbo, sofram _hardcode_ dentro do código do Emulador ou nas configurações dele propriamente.
[^5]: Pacotes que possuem informações possíveis de serem lidas por humanos via [Wireshark](https://www.wireshark.org/) ou qualquer outro software de análise da dados via _WiFi_. São criptografadas utilizando _TCP_ ou _SSL_ nas dependências Coerce e Hikari Connection Pool — ambas altamente dependentes de _HTTP Request_. Também será **mandatório** com que sejam utilizados links do tipo ``https://``.
