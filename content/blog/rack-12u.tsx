import { H2, P, Pre, Caja, Lista, Tabla, type Contenido } from '@/components/blog/Prosa';

const disposicion = `U1      Patch panel
U2      Switch
U3      Balda: mini PC
U4      Libre (aire)
U5–U6   Nodo ligero (2U)
U7–U9   Nodo pesado (3U)
U10–U12 NAS (3U, lo más pesado abajo)`;

const layout = `U1      Patch panel
U2      Switch
U3      Shelf: mini PC
U4      Empty (airflow)
U5–U6   Light node (2U)
U7–U9   Heavy node (3U)
U10–U12 NAS (3U, heaviest at the bottom)`;

export const es: Contenido = {
  indice: [['por-que', 'Por qué un rack'], ['sitio', 'El sitio manda'], ['maquinas', 'Las máquinas'], ['precios', 'Lo que cuesta'], ['orden', 'En qué orden'], ['aprendido', 'Lo aprendido hasta ahora']],
  cuerpo: (
    <>
      <P>Mi servidor de casa es un PC pequeño de oficina que hace demasiadas cosas. Este es el plan para pasar a un rack de 12U debajo de la mesa: qué va dentro, qué reutilizo, qué compro y cuánto cuesta con los precios de finales de 2026. Todavía es un plan; cuando esté montado, contaré qué salió distinto.</P>

      <H2 id="por-que">Por qué un rack</H2>
      <Lista>
        <li><strong>Separar lo que no debería ir junto.</strong> Las webs y los servicios pequeños en una máquina, lo que necesita CPU en otra y los datos en un NAS.</li>
        <li><strong>Que un fallo no se lleve todo.</strong> El módulo de RAM defectuoso de la otra entrada afectaba a la vez a las copias, las webs y todo lo demás.</li>
        <li><strong>Orden.</strong> Cables, red y alimentación en un sitio, y no cuatro cajas por el suelo.</li>
      </Lista>

      <H2 id="sitio">El sitio manda</H2>
      <P>El hueco bajo la mesa tiene 70 cm de alto, 74 de fondo y solo 54 de ancho. Los armarios de 12U habituales miden 60 de ancho. Me quedo con uno de 600 × 600 aunque sobresalga un poco, porque los estrechos que caben no admiten cajas de 8 bahías para el NAS. Lo que hay que mirar bien al comprar es el alto exterior: según el fabricante va de 64 a 74 cm, y con 74 no entra.</P>
      <Pre>{disposicion}</Pre>

      <H2 id="maquinas">Las máquinas</H2>
      <Tabla cab={['Máquina', 'Qué hace', 'Qué reutilizo', 'Qué compro']} filas={[
        ['Mini PC', 'Webs, DNS, monitorización, CI', '—', 'Un N100/N150 con 16 GB y SSD incluidos'],
        ['Nodo ligero (2U)', 'Cargas pequeñas', 'i5-8500, 24 GB, SSD', 'Placa micro-ATX, disipador bajo, fuente SFX, caja 2U'],
        ['Nodo pesado (3U)', 'Lo que necesita CPU', 'Ryzen 9 5900X, 32 GB', 'Placa B550M, NVMe 1 TB, disipador, fuente, caja 3U'],
        ['NAS (3U)', 'Datos y copias locales', 'Ryzen 5 3600, 16 GB, NVMe pequeño, un disco de 1 TB', 'NVMe 1 TB, B550M con dos M.2, caja de 8 bahías, fuente'],
      ]} />
      <P>Casi toda la CPU y la RAM las tengo ya: salen del PC de oficina actual y de mi PC de escritorio, que pasa a un procesador nuevo y deja libre el 5900X. Esa es la razón de que el plan salga razonable en un año en el que la RAM y los SSD están carísimos: compro placas, cajas y fuentes, que no han subido tanto.</P>
      <Caja tipo="ojo" titulo="La placa del PC de oficina no se trasplanta">Los PC de marca llevan placas con medidas, conectores de fuente y ventiladores propios. Lo que se pasa a la caja de rack es la CPU, la RAM y el SSD, sobre una placa estándar. Y al cambiar de placa cambia la tarjeta de red y su MAC: hay que preparar la reserva de DHCP y la configuración de red antes, o la máquina arranca sin red.</Caja>
      <P>Los dos Ryzen no tienen gráfica integrada, así que para instalarlos hace falta una gráfica cualquiera de segunda mano, aunque luego se quite.</P>

      <H2 id="precios">Lo que cuesta</H2>
      <Tabla cab={['Parte', 'Precio']} filas={[
        ['Armario, switch de 24 puertos sin ventilador, patch panel, balda, regleta', '290–375 €'],
        ['Mini PC', '135–160 €'],
        ['Nodo ligero', '175–235 €'],
        ['Nodo pesado', '325–385 €'],
        ['NAS', '345–400 €'],
        ['Gráfica de segunda mano para instalar', '20–30 €'],
        [<strong key="t">Total</strong>, <strong key="p">1.290–1.585 €</strong>],
      ]} />
      <P>El switch sin ventilador no es un capricho: el armario va en la habitación y los de empresa suenan como un secador.</P>

      <H2 id="orden">En qué orden</H2>
      <P>No hace falta comprarlo todo a la vez. Lo hago por fases, y cada fase deja algo funcionando:</P>
      <Lista>
        <li><strong>Armario y cajas</strong> primero, para ir colocando lo que ya hay.</li>
        <li><strong>Mini PC</strong>: saca las webs y los servicios de la máquina con la RAM sospechosa.</li>
        <li><strong>Nodo pesado</strong>, con el procesador que libera mi PC.</li>
        <li><strong>Nodo ligero</strong>, con las piezas del PC de oficina ya vacío, probando cada módulo de RAM antes de montarlo.</li>
        <li><strong>NAS</strong> al final.</li>
      </Lista>

      <H2 id="aprendido">Lo aprendido hasta ahora</H2>
      <Lista>
        <li>Medir el hueco antes de enamorarse de un armario.</li>
        <li>Listar lo que ya tienes antes de mirar precios: en mi caso, la mitad del presupuesto se fue en cajas y fuentes, no en potencia.</li>
        <li>Pensar en el ruido si el rack va donde duermes.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['por-que', 'Why a rack'], ['sitio', 'The space decides'], ['maquinas', 'The machines'], ['precios', 'What it costs'], ['orden', 'In what order'], ['aprendido', 'What I’ve learned so far']],
  cuerpo: (
    <>
      <P>My home server is a small office PC doing too many things. This is the plan to move to a 12U rack under my desk: what goes inside, what I reuse, what I buy and what it costs at late-2026 prices. It’s still a plan; once it’s built I’ll write about what turned out differently.</P>

      <H2 id="por-que">Why a rack</H2>
      <Lista>
        <li><strong>Separate what shouldn’t live together.</strong> Websites and small services on one machine, CPU-hungry work on another and data on a NAS.</li>
        <li><strong>So one failure doesn’t take everything.</strong> The faulty RAM module from the other post hit backups, websites and everything else at once.</li>
        <li><strong>Tidiness.</strong> Cables, network and power in one place, not four boxes on the floor.</li>
      </Lista>

      <H2 id="sitio">The space decides</H2>
      <P>The gap under the desk is 70 cm high, 74 deep and only 54 wide. Usual 12U cabinets are 60 wide. I’m going with a 600 × 600 one even if it sticks out a little, because the narrow ones that fit can’t take 8-bay cases for the NAS. The thing to check when buying is the outer height: depending on the maker it ranges from 64 to 74 cm, and at 74 it doesn’t fit.</P>
      <Pre>{layout}</Pre>

      <H2 id="maquinas">The machines</H2>
      <Tabla cab={['Machine', 'What it does', 'What I reuse', 'What I buy']} filas={[
        ['Mini PC', 'Websites, DNS, monitoring, CI', '—', 'An N100/N150 with 16 GB and SSD included'],
        ['Light node (2U)', 'Small workloads', 'i5-8500, 24 GB, SSD', 'Micro-ATX board, low-profile cooler, SFX PSU, 2U case'],
        ['Heavy node (3U)', 'CPU-hungry work', 'Ryzen 9 5900X, 32 GB', 'B550M board, 1 TB NVMe, cooler, PSU, 3U case'],
        ['NAS (3U)', 'Data and local backups', 'Ryzen 5 3600, 16 GB, small NVMe, a 1 TB disk', '1 TB NVMe, B550M with two M.2, 8-bay case, PSU'],
      ]} />
      <P>I already have nearly all the CPU and RAM: they come from the current office PC and from my desktop, which moves to a new processor and frees the 5900X. That’s why the plan stays reasonable in a year when RAM and SSDs are very expensive: I’m buying boards, cases and power supplies, which haven’t gone up as much.</P>
      <Caja tipo="ojo" titulo="The office PC board doesn’t move">Branded PCs use boards with their own sizes, power connectors and fans. What moves to the rack case is the CPU, RAM and SSD, on a standard board. And changing the board changes the network card and its MAC: prepare the DHCP reservation and network config first, or the machine boots with no network.</Caja>
      <P>Neither Ryzen has integrated graphics, so installing them needs any second-hand graphics card, even if it comes out afterwards.</P>

      <H2 id="precios">What it costs</H2>
      <Tabla cab={['Part', 'Price']} filas={[
        ['Cabinet, fanless 24-port switch, patch panel, shelf, power strip', '€290–375'],
        ['Mini PC', '€135–160'],
        ['Light node', '€175–235'],
        ['Heavy node', '€325–385'],
        ['NAS', '€345–400'],
        ['Second-hand GPU for installing', '€20–30'],
        [<strong key="t">Total</strong>, <strong key="p">€1,290–1,585</strong>],
      ]} />
      <P>The fanless switch isn’t a whim: the cabinet lives in the bedroom and enterprise switches sound like a hair dryer.</P>

      <H2 id="orden">In what order</H2>
      <P>No need to buy it all at once. I’m doing it in phases, and each one leaves something working:</P>
      <Lista>
        <li><strong>Cabinet and cases</strong> first, to start placing what I already have.</li>
        <li><strong>Mini PC</strong>: moves websites and services off the machine with the suspicious RAM.</li>
        <li><strong>Heavy node</strong>, with the processor my desktop frees.</li>
        <li><strong>Light node</strong>, with the parts of the now-empty office PC, testing each RAM module before fitting it.</li>
        <li><strong>NAS</strong> last.</li>
      </Lista>

      <H2 id="aprendido">What I’ve learned so far</H2>
      <Lista>
        <li>Measure the space before falling for a cabinet.</li>
        <li>List what you already own before looking at prices: in my case half the budget went on cases and power supplies, not on power.</li>
        <li>Think about noise if the rack lives where you sleep.</li>
      </Lista>
    </>
  ),
};
