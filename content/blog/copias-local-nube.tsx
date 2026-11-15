import { H2, P, C, Pre, Gris, Caja, Lista, Tabla, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['que', 'Qué se copia'], ['donde', 'A dónde y por qué dos sitios'], ['bases', 'Las bases de datos'], ['fuera', 'Las máquinas de fuera'], ['simulacro', 'El simulacro'], ['avisos', 'Cómo me entero'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>Una copia que nunca has restaurado es una esperanza, no una copia. Este es el sistema que tengo en mi servidor de casa, y sobre todo cómo compruebo que funciona sin esperar a necesitarlo.</P>

      <H2 id="que">Qué se copia</H2>
      <P>No copio el disco entero. Copio lo que no se puede volver a generar:</P>
      <Lista>
        <li>La configuración que no está en Ansible y los datos de cada servicio.</li>
        <li>Volcados de las bases de datos, hechos justo antes de la copia.</li>
        <li>Los datos de las máquinas de la nube, que casa se trae primero.</li>
      </Lista>
      <P>Lo demás (paquetes, la propia configuración que genera Ansible) se reconstruye con una pasada de los playbooks.</P>

      <H2 id="donde">A dónde y por qué dos sitios</H2>
      <P>Todo va con restic, que cifra antes de que los datos salgan de la máquina y deduplica, así que cada copia diaria ocupa poco más que lo que ha cambiado.</P>
      <Tabla cab={['Destino', 'Para qué']} filas={[
        ['Un disco USB en casa', 'Restaurar rápido, sin depender de internet'],
        ['La nube (vía rclone)', 'Que sobreviva a un incendio, un robo o un disco que muere con todo lo demás'],
      ]} />
      <P>Son dos repositorios con contraseñas distintas, guardadas fuera del servidor. restic y rclone van en versión fija, descargados con su suma de comprobación desde Ansible, no los que trae la distribución.</P>
      <P>Cada noche se lanza la copia, se aplica la política de retención (diarias, semanales y mensuales) y, en el mantenimiento semanal, <C>restic check</C> lee una parte de los datos para comprobar que están enteros.</P>

      <H2 id="bases">Las bases de datos</H2>
      <P>Copiar los ficheros de una base de datos en marcha da una copia que puede no arrancar. Por eso, antes de cada copia, un script vuelca cada motor (MariaDB, PostgreSQL, MongoDB) a ficheros comprimidos y restic se lleva los volcados, no los ficheros internos.</P>

      <H2 id="fuera">Las máquinas de fuera</H2>
      <P>Las máquinas de la nube no guardan ni la contraseña de restic ni acceso a la nube de las copias. Es casa la que se trae sus datos por SSH, con una clave que en el otro lado solo puede leer una carpeta:</P>
      <Pre><Gris># en la máquina de la nube, authorized_keys de root</Gris>{'\n'}restrict,command=&quot;/usr/bin/rrsync -ro /var/lib/datos&quot; ssh-ed25519 AAAA…</Pre>
      <P>Si alguien entrara en una de esas máquinas, no podría borrar ni leer las copias.</P>

      <H2 id="simulacro">El simulacro</H2>
      <P>El primer domingo de cada mes, solo, sin que yo haga nada:</P>
      <Lista>
        <li>Restaura la última copia en una carpeta temporal.</li>
        <li>Comprueba que están los ficheros que tienen que estar y que no están vacíos.</li>
        <li>Abre cada volcado de base de datos y comprueba que está entero, no solo que existe.</li>
        <li>Borra la carpeta y apunta el resultado.</li>
      </Lista>
      <Caja tipo="ojo" titulo="Por qué volcados «enteros»">Un volcado cortado a la mitad (disco lleno, proceso matado) existe y pesa algo. Solo abriéndolo se ve que no sirve.</Caja>

      <H2 id="avisos">Cómo me entero</H2>
      <P>Cada copia y cada simulacro dejan su resultado como métrica para Prometheus: cuándo terminó la última bien y si falló. Si una copia falla, me llega un mensaje directo; si pasa demasiado tiempo sin una copia buena, salta una alerta aunque nada haya dado error. Esa segunda es la importante: cubre el caso de que la copia ni siquiera se lance.</P>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Dos destinos con contraseñas distintas, y las contraseñas fuera de la máquina que se copia.</li>
        <li>Volcar las bases antes de copiarlas.</li>
        <li>Alertar por «hace demasiado que no hay una buena», no solo por «ha fallado».</li>
        <li>Restaurar de verdad, solo y a menudo. La siguiente entrada cuenta que estas comprobaciones sirvieron para algo que no esperaba.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['que', 'What gets backed up'], ['donde', 'Where, and why two places'], ['bases', 'Databases'], ['fuera', 'The machines outside'], ['simulacro', 'The drill'], ['avisos', 'How I find out'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>A backup you’ve never restored is a hope, not a backup. This is the system on my home server, and above all how I check that it works without waiting until I need it.</P>

      <H2 id="que">What gets backed up</H2>
      <P>I don’t copy the whole disk. I copy what can’t be regenerated:</P>
      <Lista>
        <li>Configuration that isn’t in Ansible and each service’s data.</li>
        <li>Database dumps, taken right before the backup.</li>
        <li>The data from the cloud machines, which home pulls in first.</li>
      </Lista>
      <P>Everything else (packages, the configuration Ansible generates) is rebuilt with one run of the playbooks.</P>

      <H2 id="donde">Where, and why two places</H2>
      <P>It all goes through restic, which encrypts before data leaves the machine and deduplicates, so each daily backup takes little more than what changed.</P>
      <Tabla cab={['Target', 'What for']} filas={[
        ['A USB disk at home', 'Fast restores, no internet needed'],
        ['The cloud (via rclone)', 'Surviving a fire, a theft or a disk that dies along with everything else'],
      ]} />
      <P>They’re two repositories with different passwords, kept off the server. restic and rclone are pinned versions, downloaded with their checksum by Ansible, not the ones the distribution ships.</P>
      <P>Every night the backup runs, the retention policy is applied (daily, weekly and monthly) and, in the weekly maintenance, <C>restic check</C> reads part of the data to make sure it’s intact.</P>

      <H2 id="bases">Databases</H2>
      <P>Copying the files of a running database gives you a backup that may not start. So before each backup, a script dumps each engine (MariaDB, PostgreSQL, MongoDB) to compressed files and restic takes the dumps, not the internal files.</P>

      <H2 id="fuera">The machines outside</H2>
      <P>The cloud machines hold neither the restic password nor access to the backup cloud. Home pulls their data over SSH, with a key that on the other side can only read one folder:</P>
      <Pre><Gris># on the cloud machine, root’s authorized_keys</Gris>{'\n'}restrict,command=&quot;/usr/bin/rrsync -ro /var/lib/data&quot; ssh-ed25519 AAAA…</Pre>
      <P>If someone got into one of those machines, they couldn’t delete or read the backups.</P>

      <H2 id="simulacro">The drill</H2>
      <P>On the first Sunday of every month, on its own, with nothing from me:</P>
      <Lista>
        <li>It restores the latest backup to a temporary folder.</li>
        <li>It checks that the files that should be there are there and aren’t empty.</li>
        <li>It opens each database dump and checks it’s complete, not just that it exists.</li>
        <li>It deletes the folder and records the result.</li>
      </Lista>
      <Caja tipo="ojo" titulo="Why “complete” dumps">A dump cut halfway (full disk, killed process) exists and has some size. Only opening it shows it’s useless.</Caja>

      <H2 id="avisos">How I find out</H2>
      <P>Every backup and every drill leaves its result as a Prometheus metric: when the last good one finished and whether it failed. If a backup fails, I get a direct message; if too much time goes by without a good backup, an alert fires even if nothing errored. That second one is the important one: it covers the backup not even starting.</P>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>Two targets with different passwords, and the passwords off the machine being backed up.</li>
        <li>Dump databases before backing them up.</li>
        <li>Alert on “too long without a good one”, not only on “it failed”.</li>
        <li>Actually restore, automatically and often. The next post tells how these checks caught something I didn’t expect.</li>
      </Lista>
    </>
  ),
};
