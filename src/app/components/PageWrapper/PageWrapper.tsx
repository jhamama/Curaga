export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="mx-auto flex max-w-3xl items-center justify-center p-8 md:max-w-6xl"
      id="page-wrapper"
    >
      {children}
    </div>
  );
};
