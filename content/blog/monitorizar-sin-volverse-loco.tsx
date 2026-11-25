import { H2, P, C, Pre, Caja, Lista, Tabla, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['piezas', 'Las piezas'], ['regla', 'La regla de las alertas'], ['las-que-quedan', 'Las que quedan'], ['quitado', 'Lo que quité'], ['vigilante', 'Quién vigila al vigilante'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>La primera versión de mi monitorización avisaba de todo. A la semana ya no leía los avisos, que es lo peor que le puede pasar a un sistema de alertas. Esta es la versión que sí uso.</P>

      <H2 id="piezas">Las piezas</H2>
      <Tabla cab={['Pieza', 'Para qué']} filas={[
        ['Prometheus', 'Guarda las métricas'],
        ['node-exporter', 'CPU, RAM, disco y red de cada máquina'],
        ['blackbox-exporter', 'Prueba desde fuera que cada web responde y cuánto le queda al certificado'],
        ['cAdvisor', 'Lo que gasta cada contenedor'],
        ['Alertmanager', 'Decide qué alerta llega y a dónde'],
        ['Grafana', 'Paneles para mirar cuando quiero, no para que me miren a mí'],
      ]} />
      <P>Todo en contenedores y todo por Ansible, con las reglas de alerta en el repo y sus pruebas con <C>promtool</C>, para que una regla mal escrita falle en el CI y no el día que hace falta.</P>

      <H2 id="regla">La regla de las alertas</H2>
      <Caja tipo="ojo" titulo="Solo avisa lo que me pide hacer algo">Si al recibir un aviso no hay nada que hacer, no es una alerta: es una métrica para un panel.</Caja>
      <P>Parece obvio y me costó aplicarlo. «La CPU está al 90 %» no me pide nada: puede ser una compilación. «Una web no responde desde hace diez minutos» sí.</P>

      <H2 id="las-que-quedan">Las que quedan</H2>
      <Lista>
        <li><strong>Una web no responde desde fuera durante 10 minutos.</strong> El <C>for: 10m</C> se come los reinicios y los cortes de un minuto.</li>
        <li><strong>Un certificado caduca en menos de 14 días.</strong> Si la renovación automática falla, me entero con margen.</li>
        <li><strong>Una copia de seguridad no ha terminado bien en su ventana.</strong></li>
        <li><strong>Un servicio de systemd ha fallado.</strong></li>
      </Lista>
      <Pre>- alert: SinRespuestaHTTPS{'\n'}  expr: probe_success{'{'}job=&quot;https&quot;{'}'} == 0{'\n'}  for: 10m{'\n'}  annotations:{'\n'}    summary: &quot;{'{{ $labels.instance }}'} no responde desde fuera&quot;</Pre>
      <P>Para saber qué servicios de systemd están caídos sin dar a node-exporter acceso al bus del sistema, uso un timer que cada 30 segundos escribe su estado en un fichero de texto que node-exporter lee. Menos permisos para el exportador y el mismo resultado.</P>

      <H2 id="quitado">Lo que quité</H2>
      <Lista>
        <li><strong>Avisos de «anomalías» en los logs.</strong> Aprendían qué era normal y avisaban de lo raro. Lo raro era casi siempre inofensivo. Ahora lo apuntan en silencio y solo se miran si estoy investigando algo.</li>
        <li><strong>Avisos de CPU y RAM altas.</strong> A un panel.</li>
        <li><strong>Avisos de cada intento de entrar por SSH.</strong> En internet hay miles al día; lo que importa es si alguien entra, no si lo intenta.</li>
      </Lista>
      <P>En su lugar, un resumen cada mañana a las 9: cómo fueron las copias, cuánto disco queda y cualquier cosa rara del día anterior. Si todo está bien, se lee en diez segundos.</P>

      <H2 id="vigilante">Quién vigila al vigilante</H2>
      <P>Si se cae el servidor de casa, se cae también Prometheus y nadie avisa de nada. Por eso hay un vigilante fuera: un pequeño worker en la nube que cada pocos minutos comprueba que mi servidor responde y que el propio Alertmanager ha dado señales de vida. Si no, me avisa por otro camino.</P>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Menos alertas y todas de verdad es mejor que muchas y ninguna leída.</li>
        <li>El <C>for:</C> de cada regla vale más que la propia expresión.</li>
        <li>Probar las reglas como si fueran código (<C>promtool test rules</C>) evita sorpresas.</li>
        <li>Un sistema de alertas que vive en la máquina que vigila necesita a alguien fuera.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['piezas', 'The pieces'], ['regla', 'The alerting rule'], ['las-que-quedan', 'The ones that stayed'], ['quitado', 'What I removed'], ['vigilante', 'Who watches the watcher'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>The first version of my monitoring alerted on everything. A week in I had stopped reading the alerts, which is the worst thing that can happen to an alerting system. This is the version I actually use.</P>

      <H2 id="piezas">The pieces</H2>
      <Tabla cab={['Piece', 'What for']} filas={[
        ['Prometheus', 'Stores the metrics'],
        ['node-exporter', 'CPU, RAM, disk and network of each machine'],
        ['blackbox-exporter', 'Checks from outside that each site responds and how long its certificate has left'],
        ['cAdvisor', 'What each container uses'],
        ['Alertmanager', 'Decides which alert gets through and where'],
        ['Grafana', 'Dashboards to look at when I want, not to be looked at'],
      ]} />
      <P>All in containers and all through Ansible, with alert rules in the repo and tested with <C>promtool</C>, so a badly written rule fails in CI and not on the day it’s needed.</P>

      <H2 id="regla">The alerting rule</H2>
      <Caja tipo="ojo" titulo="Only alert on what needs me to act">If there’s nothing to do when an alert arrives, it isn’t an alert: it’s a metric for a dashboard.</Caja>
      <P>Sounds obvious and it took me a while to apply. “CPU at 90%” doesn’t ask anything of me: it could be a build. “A site hasn’t responded for ten minutes” does.</P>

      <H2 id="las-que-quedan">The ones that stayed</H2>
      <Lista>
        <li><strong>A site doesn’t respond from outside for 10 minutes.</strong> The <C>for: 10m</C> swallows restarts and one-minute blips.</li>
        <li><strong>A certificate expires in less than 14 days.</strong> If automatic renewal fails, I find out with time to spare.</li>
        <li><strong>A backup didn’t finish well within its window.</strong></li>
        <li><strong>A systemd service has failed.</strong></li>
      </Lista>
      <Pre>- alert: NoHTTPSResponse{'\n'}  expr: probe_success{'{'}job=&quot;https&quot;{'}'} == 0{'\n'}  for: 10m{'\n'}  annotations:{'\n'}    summary: &quot;{'{{ $labels.instance }}'} not responding from outside&quot;</Pre>
      <P>To know which systemd services are down without giving node-exporter access to the system bus, a timer writes their state to a text file every 30 seconds and node-exporter reads it. Fewer permissions for the exporter, same result.</P>

      <H2 id="quitado">What I removed</H2>
      <Lista>
        <li><strong>Log “anomaly” alerts.</strong> They learned what was normal and alerted on the unusual. The unusual was almost always harmless. Now they’re recorded quietly and only looked at when I’m investigating something.</li>
        <li><strong>High CPU and RAM alerts.</strong> Moved to a dashboard.</li>
        <li><strong>Alerts for every SSH login attempt.</strong> There are thousands a day on the internet; what matters is whether someone gets in, not whether they try.</li>
      </Lista>
      <P>Instead, a summary every morning at 9: how the backups went, how much disk is left and anything odd from the day before. If all is well, it takes ten seconds to read.</P>

      <H2 id="vigilante">Who watches the watcher</H2>
      <P>If the home server goes down, Prometheus goes with it and nobody alerts anyone. So there’s a watcher outside: a small worker in the cloud that checks every few minutes that my server responds and that Alertmanager itself has shown signs of life. If not, it warns me another way.</P>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>Fewer alerts, all real, beats many alerts nobody reads.</li>
        <li>A rule’s <C>for:</C> is worth more than its expression.</li>
        <li>Testing rules like code (<C>promtool test rules</C>) avoids surprises.</li>
        <li>An alerting system living on the machine it watches needs someone outside.</li>
      </Lista>
    </>
  ),
};
