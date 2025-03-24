export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center px-6">
        Loading environment... be patient.
      </h1>
      <p className="mt-4 text-sm text-center">Created by George Wang</p>

      <div>
        <p className="mt-15 text-m text-center">Works best on a bigger screen—laptop or desktop recommended.</p>
        <p>Report bugs: gwang10@opusd.us</p>
      </div>
    </div>

  );
}
