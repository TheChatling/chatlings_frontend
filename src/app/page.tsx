import AuthWrapper from "@/components/AuthWrapper";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <AuthWrapper>
      <Hero />
    </AuthWrapper>
  );
}
