import Image from 'next/image';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="LaunchForge AI Logo" width={32} height={32} />
      <span className="text-lg font-bold">LaunchForge AI</span>
    </div>
  );
};
