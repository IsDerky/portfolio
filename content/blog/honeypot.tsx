import { H2, P, C, Pre, Gris, Caja, Lista, Tabla, type Contenido } from '@/components/blog/Prosa';

const n = (x: number, idioma: 'es' | 'en') => x.toLocaleString(idioma === 'es' ? 'es-ES' : 'en-GB');

const cifras = (idioma: 'es' | 'en') => {
  const es = idioma === 'es';

  return (
    <Tabla cab={es ? ['En 30 días', ''] : ['In 30 days', '']} filas={[
      [es ? 'Intentos por SSH' : 'SSH attempts', n(78076, idioma)],
      [es ? 'Intentos por Telnet' : 'Telnet attempts', n(6736, idioma)],
      [es ? 'Peticiones al señuelo web' : 'Requests to the web decoy', n(10705, idioma)],
      [es ? 'IPs distintas' : 'Distinct IPs', n(3845, idioma)],
      [es ? 'Contraseñas probadas' : 'Passwords tried', n(77448, idioma)],
    ]} />
  );
};

export const es: Contenido = {
  indice: [['montaje', 'El montaje'], ['aislado', 'Que no se escape'], ['cifras', 'Treinta días en cifras'], ['usuarios', 'Usuarios y contraseñas'], ['dentro', 'Qué hacen cuando creen que han entrado'], ['web', 'El señuelo web'], ['cambios', 'Lo que me llevo a mis máquinas']],
  cuerpo: (
    <>
      <P>Un honeypot es una máquina falsa puesta a propósito para que la ataquen. La mía es Cowrie: un SSH y un Telnet que aceptan casi cualquier contraseña y enseñan una shell de mentira. Todo lo que hacen se apunta. Estos son treinta días de datos.</P>

      <H2 id="montaje">El montaje</H2>
      <P>Cowrie corre en un contenedor en mi servidor de casa, con los puertos de SSH y Telnet abiertos a internet apuntando a él. Mi SSH de verdad es otro y solo acepta claves. Un recolector lee los logs de Cowrie y los guarda agregados por hora en una base SQLite, que es de donde salen todas las cifras de abajo, con el país y la red de cada IP.</P>

      <H2 id="aislado">Que no se escape</H2>
      <P>Invitar a los bots a entrar en tu casa tiene un riesgo obvio: que el contenedor sirva de trampolín hacia la red local. Lo aíslo por capas:</P>
      <Lista>
        <li>Usuario sin privilegios, sistema de ficheros de solo lectura y sin capacidades extra.</li>
        <li>Reglas en la cadena <C>DOCKER-USER</C> de iptables que no dejan salir al contenedor hacia la red local.</li>
        <li>Una prueba de aislamiento al arrancar: si desde dentro se llega a algo que no debería, el servicio se para solo.</li>
      </Lista>
      <Caja tipo="mal" titulo="Lo que no hace">No ejecuta nada de verdad. Los ficheros que descargan se guardan para mirarlos, pero nunca se ejecutan.</Caja>

      <H2 id="cifras">Treinta días en cifras</H2>
      {cifras('es')}
      <P>Más de 2.800 intentos al día de media. Rumanía encabeza los intentos, pero casi todos salen de una sola red: 86 IPs que se turnan probando lo mismo sin descanso. Estados Unidos tiene muchas más IPs distintas (953), repartidas por proveedores de nube. China aporta 554 IPs y muy pocos intentos por cada una: barridos que tocan la puerta y se van.</P>
      <P>El cliente SSH que dicen usar también cuenta cosas: <C>libssh 0.9.6</C> en 580 IPs, <C>Go</C> en 320 y <C>ZGrab</C>, una herramienta de escaneo de internet, en 64. Ninguno es un humano con un terminal.</P>

      <H2 id="usuarios">Usuarios y contraseñas</H2>
      <Tabla cab={['Usuario', 'Intentos']} filas={[['root', '29.950'], ['ubuntu', '3.720'], ['admin', '2.689'], ['user', '1.351'], ['deploy', '1.114'], ['test', '944'], ['claude', '521']]} />
      <P>root, como siempre. <C>ubuntu</C> y <C>deploy</C> buscan servidores en la nube recién creados. Y <C>claude</C>, 521 veces: alguien supone que hay máquinas con un usuario creado para un asistente de IA. Señal de los tiempos.</P>
      <P>Las parejas más repetidas: <C>admin / admin</C> (1.968), <C>support / support</C>, <C>root</C> sin contraseña (417) y <C>root / 123456</C>. Y una rara, <C>345gs5662d34</C> como usuario y contraseña, que es la firma de una botnet conocida: la usan para reconocer las máquinas que ya han infectado.</P>
      <P>De las 77.448 contraseñas, la longitud más común es 8 y luego 6; un tercio son solo letras y casi una cuarta parte solo números.</P>

      <H2 id="dentro">Qué hacen cuando creen que han entrado</H2>
      <P>Lo primero, casi siempre, es preguntar qué máquina es:</P>
      <Pre>uname -s -v -n -r -m      <Gris># 54.802 veces</Gris></Pre>
      <P>Con eso deciden qué binario descargar: he visto los mismos programas compilados para x86_64 y para MIPS, el procesador de muchos routers. Por Telnet llegan sobre todo intentos de salir de la consola de un router (<C>enable</C>, <C>system</C>, <C>shell</C>, <C>linuxshell</C>) y <C>/bin/busybox HISILICON</C>, que busca cámaras con chips de ese fabricante.</P>
      <P>Dos cosas me llamaron la atención:</P>
      <Lista>
        <li><strong>Limpian a la competencia.</strong> Un script recorre <C>/proc</C> y mata los procesos cuyo ejecutable ha sido borrado, que es lo típico de otro malware.</li>
        <li><strong>Se quedan la llave.</strong> Quitan los atributos de <C>~/.ssh</C> con <C>chattr</C>, lo borran y ponen su propia clave pública. Si eso pasa en una máquina de verdad, cambiar la contraseña ya no sirve.</li>
      </Lista>

      <H2 id="web">El señuelo web</H2>
      <P>También hay un pequeño señuelo HTTP. Lo que más piden: <C>/.env</C> y doce variantes (<C>.env.production</C>, <C>.env.local</C>, <C>.env.bak</C>…), <C>/.git/config</C>, una ruta típica de cámaras IP y <C>CONNECT</C> hacia una web de pruebas para ver si soy un proxy abierto.</P>

      <H2 id="cambios">Lo que me llevo a mis máquinas</H2>
      <Lista>
        <li>SSH solo con claves en todas, root sin entrar con contraseña y la lista de usuarios permitidos escrita con nombre.</li>
        <li>Que ningún servidor web sirva un <C>.env</C> o un <C>.git</C>: es lo primero que piden.</li>
        <li>Si algún día entra alguien, mirar los <C>authorized_keys</C> antes que la contraseña.</li>
        <li>Ningún usuario que se llame como un servicio o un asistente con contraseña.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['montaje', 'The setup'], ['aislado', 'Keeping it contained'], ['cifras', 'Thirty days in numbers'], ['usuarios', 'Usernames and passwords'], ['dentro', 'What they do once “in”'], ['web', 'The web decoy'], ['cambios', 'What I take to my machines']],
  cuerpo: (
    <>
      <P>A honeypot is a fake machine put out on purpose to be attacked. Mine is Cowrie: an SSH and a Telnet that accept almost any password and show a fake shell. Everything they do is logged. This is thirty days of data.</P>

      <H2 id="montaje">The setup</H2>
      <P>Cowrie runs in a container on my home server, with the SSH and Telnet ports open to the internet pointing at it. My real SSH is a different one and only takes keys. A collector reads Cowrie’s logs and stores them aggregated per hour in a SQLite database, which is where every number below comes from, along with each IP’s country and network.</P>

      <H2 id="aislado">Keeping it contained</H2>
      <P>Inviting bots into your house has an obvious risk: the container becoming a stepping stone into the local network. I isolate it in layers:</P>
      <Lista>
        <li>An unprivileged user, a read-only filesystem and no extra capabilities.</li>
        <li>Rules in iptables’ <C>DOCKER-USER</C> chain that stop the container from reaching the local network.</li>
        <li>An isolation test at startup: if something that shouldn’t be reachable is reachable from inside, the service stops itself.</li>
      </Lista>
      <Caja tipo="mal" titulo="What it doesn’t do">It doesn’t run anything for real. Files they download are kept for inspection but never executed.</Caja>

      <H2 id="cifras">Thirty days in numbers</H2>
      {cifras('en')}
      <P>Over 2,800 attempts a day on average. Romania leads in attempts, but nearly all of them come from a single network: 86 IPs taking turns trying the same thing nonstop. The US has far more distinct IPs (953), spread across cloud providers. China contributes 554 IPs and very few attempts each: sweeps that knock and move on.</P>
      <P>The SSH client they claim to use tells a story too: <C>libssh 0.9.6</C> on 580 IPs, <C>Go</C> on 320 and <C>ZGrab</C>, an internet scanning tool, on 64. None of them is a human at a terminal.</P>

      <H2 id="usuarios">Usernames and passwords</H2>
      <Tabla cab={['Username', 'Attempts']} filas={[['root', '29,950'], ['ubuntu', '3,720'], ['admin', '2,689'], ['user', '1,351'], ['deploy', '1,114'], ['test', '944'], ['claude', '521']]} />
      <P>root, as always. <C>ubuntu</C> and <C>deploy</C> go after freshly created cloud servers. And <C>claude</C>, 521 times: someone assumes there are machines with a user created for an AI assistant. Sign of the times.</P>
      <P>The most repeated pairs: <C>admin / admin</C> (1,968), <C>support / support</C>, <C>root</C> with no password (417) and <C>root / 123456</C>. And an odd one, <C>345gs5662d34</C> as both username and password, which is the signature of a known botnet: it uses it to recognise machines it has already infected.</P>
      <P>Of the 77,448 passwords, the most common length is 8, then 6; a third are letters only and almost a quarter digits only.</P>

      <H2 id="dentro">What they do once “in”</H2>
      <P>The first thing, almost always, is asking what machine this is:</P>
      <Pre>uname -s -v -n -r -m      <Gris># 54,802 times</Gris></Pre>
      <P>That decides which binary to download: I’ve seen the same programs built for x86_64 and for MIPS, the processor in many routers. Telnet brings mostly attempts to break out of a router console (<C>enable</C>, <C>system</C>, <C>shell</C>, <C>linuxshell</C>) and <C>/bin/busybox HISILICON</C>, which looks for cameras with that vendor’s chips.</P>
      <P>Two things caught my eye:</P>
      <Lista>
        <li><strong>They clean up the competition.</strong> A script walks <C>/proc</C> and kills processes whose executable has been deleted, which is typical of other malware.</li>
        <li><strong>They keep the key.</strong> They strip <C>~/.ssh</C>’s attributes with <C>chattr</C>, delete it and drop in their own public key. If that happens on a real machine, changing the password no longer helps.</li>
      </Lista>

      <H2 id="web">The web decoy</H2>
      <P>There’s also a small HTTP decoy. Most requested: <C>/.env</C> and twelve variants (<C>.env.production</C>, <C>.env.local</C>, <C>.env.bak</C>…), <C>/.git/config</C>, a path typical of IP cameras, and <C>CONNECT</C> to a test site to see whether I’m an open proxy.</P>

      <H2 id="cambios">What I take to my machines</H2>
      <Lista>
        <li>Key-only SSH everywhere, no password login for root and the allowed users written down by name.</li>
        <li>No web server should ever serve a <C>.env</C> or a <C>.git</C>: it’s the first thing they ask for.</li>
        <li>If someone ever gets in, check <C>authorized_keys</C> before the password.</li>
        <li>No users named after a service or an assistant with a password.</li>
      </Lista>
    </>
  ),
};
