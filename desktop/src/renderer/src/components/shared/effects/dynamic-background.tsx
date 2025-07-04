export default function DynamicBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-30">
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );
}
