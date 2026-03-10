export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F6FF" }}>
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#070738", fontFamily: "Playfair Display, serif" }}>
          Link inválido
        </h1>
        <p className="text-gray-500 text-sm">
          Este link não existe ou foi desativado.<br />
          Entre em contato com a EIC para obter seu link pessoal.
        </p>
        <p className="mt-6 text-sm font-medium" style={{ color: "#6B3FA0" }}>eicschool.com.br</p>
      </div>
    </div>
  );
}
