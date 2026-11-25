// La D con el hueco abajo; toma el color del texto para ir con los dos temas
export default function LogoD({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 120" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 8H66L98 40V82L76 112H44V90H66L76 76V48L58 30H35V112H13Z" />
    </svg>
  );
}
