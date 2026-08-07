export default function ActorLayout({
  children,
  awards,
  social,
  similar,
}: {
  children: React.ReactNode;
  awards: React.ReactNode;
  social: React.ReactNode;
  similar: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            {awards}
          </div>
          <div className="space-y-8">
            {social}
            {similar}
          </div>
        </div>
      </div>
    </>
  );
}
