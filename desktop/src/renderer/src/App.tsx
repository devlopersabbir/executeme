import Footer from "@renderer/components/shared/footer";
import DynamicBackground from "@renderer/components/shared/effects/dynamic-background";
import Header from "@renderer/components/header";
import CodeInput from "./_components/code-input";

export default function ExecuteMePlatform() {
  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      <DynamicBackground />

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        <Header />

        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 transition-all ease-in-out">
          <CodeInput />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
