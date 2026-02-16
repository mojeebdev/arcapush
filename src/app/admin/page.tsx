export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        VibeStream Admin
      </h1>
      <p className="text-gray-400">Secure Guardian Access. Monitor your waitlist here.</p>
      
      {/* Later we can add your table for food items/waitlist here */}
      <div className="mt-10 p-6 border border-white/10 rounded-2xl bg-white/5">
        <p>Waitlist tracking coming soon...</p>
      </div>
    </div>
  );
}