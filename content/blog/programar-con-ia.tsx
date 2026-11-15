import { H2, P, C, Caja, Lista, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['como', 'Cómo trabajo'], ['bien', 'Lo que hace bien'], ['mal', 'Dónde se equivoca'], ['reglas', 'Mis reglas'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>Llevo unos meses usando un asistente de IA en la terminal para casi todo lo de mi servidor de casa: roles de Ansible, scripts, pruebas, páginas, investigar fallos. No es magia ni es un becario: es otra forma de trabajar, con sus reglas. Estas son las mías.</P>

      <H2 id="como">Cómo trabajo</H2>
      <P>Yo decido qué se hace y en qué orden; el asistente lee el código, propone, escribe y prueba. Lo que toca producción lo ejecuto yo. Él tiene una cuenta de solo lectura en los servidores: puede mirar logs, servicios y puertos, pero no cambiar nada. Si hay que aplicar algo, me prepara el comando o el script y yo lo lanzo.</P>

      <H2 id="bien">Lo que hace bien</H2>
      <Lista>
        <li><strong>Leer mucho código rápido</strong> y encontrar dónde se toca algo, incluido código de terceros que no conozco.</li>
        <li><strong>Escribir las pruebas</strong> que a mí me da pereza escribir: scripts que montan el caso, comprueban y terminan en «TODO OK» o en la lista de fallos.</li>
        <li><strong>Investigar un fallo</strong> cruzando logs, configuración y código. Con la RAM defectuosa fue el que juntó las pistas.</li>
        <li><strong>Lo aburrido bien hecho</strong>: un rol de Ansible con su README, sus comprobaciones y su prueba local.</li>
      </Lista>

      <H2 id="mal">Dónde se equivoca</H2>
      <Lista>
        <li><strong>Da cosas por hechas que no ha comprobado.</strong> Si no le pido que lo verifique, a veces afirma que algo existe porque «suele existir».</li>
        <li><strong>Escribe de más.</strong> Comentarios obvios, textos con tono de anuncio. Hay que pedirle que sea escueto y revisar.</li>
        <li><strong>Se confunde de entorno.</strong> Windows, WSL, el servidor: si no le dices dónde se ejecuta cada cosa, mezcla rutas y comillas.</li>
        <li><strong>Las pruebas que escribe también se equivocan.</strong> Un fallo en una prueba puede ser de la prueba. Pasó con una fecha: la prueba esperaba «el lunes» y el lunes era mañana.</li>
      </Lista>
      <Caja tipo="bien" titulo="El caso que más me gustó">Al probar una configuración nueva de un servidor web, la prueba falló porque el puerto 80 estaba ocupado. Mirando por qué, salió que ese servidor abría el 80 por su cuenta, y en producción eso habría roto la renovación de un certificado dos meses después. Lo cuento en la entrada de Docker y los puertos.</Caja>

      <H2 id="reglas">Mis reglas</H2>
      <Lista>
        <li><strong>Un paso cada vez</strong> cuando lo ejecuto yo: un comando, miro la salida, siguiente.</li>
        <li><strong>Cada comando dice dónde se ejecuta</strong>: en el portátil, en WSL o por SSH en qué máquina.</li>
        <li><strong>Antes de cambiar algo visual, un boceto</strong> en HTML de verdad, con datos realistas. Lo apruebo y luego se programa.</li>
        <li><strong>Nada de secretos en la conversación.</strong> Si hace falta una contraseña, va a un fichero o a un ajuste y nunca se imprime.</li>
        <li><strong>Memoria en ficheros.</strong> Al terminar, lo hecho y lo pendiente se apunta en notas que el asistente lee al empezar la siguiente sesión. Sin eso, cada día empieza de cero.</li>
        <li><strong>Antes de publicar, revisar fugas.</strong> En lo que va a un repositorio público se buscan IPs, dominios internos y nombres de máquinas.</li>
        <li><strong>Lo que se rechaza, se apunta.</strong> Si digo que no a una idea, queda escrito para que no vuelva a salir cada semana.</li>
      </Lista>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Rinde más cuanto mejor sé lo que quiero. Si yo no lo tengo claro, él tampoco.</li>
        <li>Las pruebas son el contrato: «está hecho» significa que la prueba pasa, no que el código existe.</li>
        <li>Revisar lo que escribe sigue siendo mi trabajo, y tiene que serlo.</li>
        <li>Ha cambiado más qué cosas me atrevo a hacer que lo rápido que las hago. Este blog, por ejemplo.</li>
      </Lista>
      <P>Curiosamente, en la honeypot el usuario <C>claude</C> aparece 521 veces en un mes: los bots ya dan por hecho que hay máquinas con un usuario para un asistente. El mío no tiene contraseña: entra solo con clave y solo puede leer.</P>
    </>
  ),
};

export const en: Contenido = {
  indice: [['como', 'How I work'], ['bien', 'What it does well'], ['mal', 'Where it gets things wrong'], ['reglas', 'My rules'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>For a few months now I’ve used an AI assistant in the terminal for almost everything on my home server: Ansible roles, scripts, tests, pages, chasing bugs. It isn’t magic and it isn’t an intern: it’s another way of working, with its own rules. These are mine.</P>

      <H2 id="como">How I work</H2>
      <P>I decide what gets done and in what order; the assistant reads the code, proposes, writes and tests. Anything that touches production, I run. It has a read-only account on the servers: it can look at logs, services and ports, but change nothing. If something has to be applied, it prepares the command or script and I launch it.</P>

      <H2 id="bien">What it does well</H2>
      <Lista>
        <li><strong>Reading lots of code fast</strong> and finding where something is touched, including third-party code I don’t know.</li>
        <li><strong>Writing the tests</strong> I can’t be bothered to: scripts that set up the case, check it and end in “ALL OK” or a list of failures.</li>
        <li><strong>Chasing a bug</strong> across logs, configuration and code. With the faulty RAM, it was the one that put the clues together.</li>
        <li><strong>Boring things done right</strong>: an Ansible role with its README, its checks and its local test.</li>
      </Lista>

      <H2 id="mal">Where it gets things wrong</H2>
      <Lista>
        <li><strong>It assumes things it hasn’t checked.</strong> Unless asked to verify, it sometimes states that something exists because it “usually does”.</li>
        <li><strong>It writes too much.</strong> Obvious comments, copy that sounds like an ad. You have to ask it to be brief and review.</li>
        <li><strong>It mixes up environments.</strong> Windows, WSL, the server: unless told where each thing runs, it mixes paths and quoting.</li>
        <li><strong>Its tests can be wrong too.</strong> A failing test may be the test’s fault. It happened with a date: the test expected “Monday” and Monday was tomorrow.</li>
      </Lista>
      <Caja tipo="bien" titulo="My favourite case">While testing a new web server configuration, the test failed because port 80 was taken. Looking into why, it turned out that server opened port 80 on its own, and in production that would have broken a certificate renewal two months later. It’s in the Docker and ports post.</Caja>

      <H2 id="reglas">My rules</H2>
      <Lista>
        <li><strong>One step at a time</strong> when I’m the one running it: one command, check the output, next.</li>
        <li><strong>Every command says where it runs</strong>: on the laptop, in WSL or over SSH on which machine.</li>
        <li><strong>A mockup before any visual change</strong>, in real HTML with realistic data. I approve it, then it gets built.</li>
        <li><strong>No secrets in the conversation.</strong> If a password is needed, it goes into a file or a setting and is never printed.</li>
        <li><strong>Memory in files.</strong> At the end, what’s done and what’s pending goes into notes the assistant reads when the next session starts. Without that, every day starts from zero.</li>
        <li><strong>Check for leaks before publishing.</strong> Anything going to a public repo is searched for IPs, internal domains and machine names.</li>
        <li><strong>Rejected ideas get written down.</strong> If I say no to something, it’s recorded so it doesn’t come back every week.</li>
      </Lista>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>It delivers more the better I know what I want. If I’m not clear, neither is it.</li>
        <li>Tests are the contract: “done” means the test passes, not that the code exists.</li>
        <li>Reviewing what it writes is still my job, and it should be.</li>
        <li>What changed most is which things I dare to take on, more than how fast I do them. This blog, for instance.</li>
      </Lista>
      <P>Funnily enough, on the honeypot the username <C>claude</C> shows up 521 times in a month: bots already assume there are machines with a user for an assistant. Mine has no password: it logs in only with a key and can only read.</P>
    </>
  ),
};
