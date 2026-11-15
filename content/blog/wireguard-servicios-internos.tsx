import { H2, P, C, Pre, Gris, Caja, Lista, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['montaje', 'El montaje'], ['quien-llama', 'Quién llama a quién'], ['solo-tunel', 'Servicios solo en el túnel'], ['arranque', 'El orden de arranque'], ['sorpresa', 'La sorpresa de la imagen'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>Además del servidor de casa tengo un par de máquinas en la nube. Necesitaba que se hablaran entre ellas (métricas, bases de datos, la configuración de algunos servicios) sin abrir nada de eso a internet. WireGuard lo resuelve con muy poco.</P>

      <H2 id="montaje">El montaje</H2>
      <P>Una red privada pequeña solo para el túnel: casa tiene la primera dirección y cada máquina de la nube la suya. Nada de malla completa: las máquinas de la nube solo necesitan hablar con casa.</P>
      <Pre><Gris># casa: un [Peer] por máquina de la nube</Gris>{'\n'}[Interface]{'\n'}Address = 10.x.y.1/24{'\n'}PrivateKey = …{'\n\n'}[Peer]{'\n'}PublicKey = …{'\n'}AllowedIPs = 10.x.y.2/32{'\n'}Endpoint = maquina-a.ejemplo:51820{'\n'}PersistentKeepalive = 25</Pre>
      <P>La configuración la genera Ansible: cada máquina tiene su dirección del túnel en el inventario y el rol monta los <C>[Peer]</C> cruzando las claves públicas.</P>

      <H2 id="quien-llama">Quién llama a quién</H2>
      <P>Las máquinas de la nube tienen IP fija y escuchan en el puerto de WireGuard. Casa no escucha: es ella la que conecta hacia fuera, con <C>PersistentKeepalive</C> para que el NAT del router no cierre el túnel. Así, en el router de casa no hay que abrir ningún puerto, y si mi IP cambia, el túnel se rehace solo.</P>

      <H2 id="solo-tunel">Servicios solo en el túnel</H2>
      <P>Lo interesante no es el túnel, es lo que pasa encima. Los servicios internos de las máquinas de la nube escuchan <strong>solo en su dirección del túnel</strong>, no en <C>0.0.0.0</C>:</P>
      <Lista>
        <li>node-exporter, que Prometheus lee desde casa.</li>
        <li>Las bases de datos, a las que solo entra el servidor de casa.</li>
        <li>La API de administración de algún servicio que configuro desde casa.</li>
      </Lista>
      <P>Y el cortafuegos lo remata: el puerto solo se abre por la interfaz del túnel y solo desde la dirección de casa.</P>
      <Pre>ufw allow in on wg0 from 10.x.y.1 to any port 9100 proto tcp</Pre>
      <Caja tipo="ojo" titulo="Dos capas, a propósito">Si mañana alguien cambia el servicio para que escuche en todas las interfaces, el cortafuegos sigue cerrando. Si alguien abre el cortafuegos de más, el servicio sigue sin escuchar fuera. Hace falta equivocarse dos veces.</Caja>

      <H2 id="arranque">El orden de arranque</H2>
      <P>Un servicio que se ata a la dirección del túnel no puede arrancar antes que el túnel: esa dirección todavía no existe. Me pasó con node-exporter después de un reinicio. La solución es decírselo a systemd:</P>
      <Pre>[Unit]{'\n'}After=wg-quick@wg0.service{'\n'}Requires=wg-quick@wg0.service</Pre>
      <P>Y en los roles de Ansible, una comprobación de que la dirección existe en la máquina antes de configurar nada que dependa de ella.</P>

      <H2 id="sorpresa">La sorpresa de la imagen</H2>
      <P>Configuré ufw en las máquinas de la nube, abrí el puerto de WireGuard y no llegaba nada. La imagen del proveedor trae su propio iptables con un <C>REJECT</C> al final de <C>INPUT</C>, que va antes que las reglas de ufw. Hubo que añadir las reglas también ahí, en el fichero que se carga al arrancar y en caliente, sin guardar todo el iptables (que se habría llevado también las reglas de Docker).</P>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Que la casa llame hacia fuera ahorra abrir puertos y pelearse con la IP dinámica.</li>
        <li>Atar los servicios a la IP del túnel más el cortafuegos es la combinación que me deja tranquilo.</li>
        <li>Antes de fiarte del cortafuegos de una imagen en la nube, mira qué trae ya puesto.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['montaje', 'The setup'], ['quien-llama', 'Who calls whom'], ['solo-tunel', 'Services only on the tunnel'], ['arranque', 'Boot order'], ['sorpresa', 'The image surprise'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>Besides the home server I have a couple of machines in the cloud. They needed to talk to each other (metrics, databases, the configuration of some services) without exposing any of that to the internet. WireGuard does it with very little.</P>

      <H2 id="montaje">The setup</H2>
      <P>A small private network just for the tunnel: home has the first address and each cloud machine has its own. No full mesh: the cloud machines only need to talk to home.</P>
      <Pre><Gris># home: one [Peer] per cloud machine</Gris>{'\n'}[Interface]{'\n'}Address = 10.x.y.1/24{'\n'}PrivateKey = …{'\n\n'}[Peer]{'\n'}PublicKey = …{'\n'}AllowedIPs = 10.x.y.2/32{'\n'}Endpoint = machine-a.example:51820{'\n'}PersistentKeepalive = 25</Pre>
      <P>Ansible generates the configuration: each machine has its tunnel address in the inventory and the role builds the <C>[Peer]</C> sections by crossing the public keys.</P>

      <H2 id="quien-llama">Who calls whom</H2>
      <P>The cloud machines have fixed IPs and listen on the WireGuard port. Home doesn’t listen: it dials out, with <C>PersistentKeepalive</C> so the router’s NAT doesn’t close the tunnel. That way no port has to be opened on the home router, and if my IP changes, the tunnel rebuilds itself.</P>

      <H2 id="solo-tunel">Services only on the tunnel</H2>
      <P>The interesting part isn’t the tunnel, it’s what runs on top. Internal services on the cloud machines listen <strong>only on their tunnel address</strong>, not on <C>0.0.0.0</C>:</P>
      <Lista>
        <li>node-exporter, which Prometheus reads from home.</li>
        <li>The databases, which only the home server connects to.</li>
        <li>The admin API of a service I configure from home.</li>
      </Lista>
      <P>The firewall finishes the job: the port only opens on the tunnel interface and only from the home address.</P>
      <Pre>ufw allow in on wg0 from 10.x.y.1 to any port 9100 proto tcp</Pre>
      <Caja tipo="ojo" titulo="Two layers, on purpose">If someone later makes the service listen on every interface, the firewall still blocks it. If someone opens the firewall too much, the service still isn’t listening outside. It takes two mistakes.</Caja>

      <H2 id="arranque">Boot order</H2>
      <P>A service bound to the tunnel address can’t start before the tunnel: that address doesn’t exist yet. It happened to me with node-exporter after a reboot. The fix is telling systemd:</P>
      <Pre>[Unit]{'\n'}After=wg-quick@wg0.service{'\n'}Requires=wg-quick@wg0.service</Pre>
      <P>And in the Ansible roles, a check that the address exists on the machine before configuring anything that depends on it.</P>

      <H2 id="sorpresa">The image surprise</H2>
      <P>I set up ufw on the cloud machines, opened the WireGuard port and nothing got through. The provider’s image ships its own iptables with a <C>REJECT</C> at the end of <C>INPUT</C>, which comes before ufw’s rules. The rules had to go there too, in the file loaded at boot and live, without saving the whole iptables (which would also have captured Docker’s rules).</P>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>Having home dial out saves opening ports and fighting a dynamic IP.</li>
        <li>Binding services to the tunnel IP plus the firewall is the combination that lets me sleep.</li>
        <li>Before trusting the firewall on a cloud image, check what it already ships with.</li>
      </Lista>
    </>
  ),
};
