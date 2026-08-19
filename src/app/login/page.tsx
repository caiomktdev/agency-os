import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Agency OS</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Entre para acessar o hub central da agência.
        </p>
        <LoginForm next={next ?? "/"} />
      </div>
    </div>
  );
}
