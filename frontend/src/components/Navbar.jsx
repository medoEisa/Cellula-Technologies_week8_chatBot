export default function Navbar({ user, onLogout }) {
  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h1 className="font-bold text-xl">Cellula Chat</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.username}</span>
          <button onClick={onLogout} className="bg-white text-purple-500 px-3 py-1 rounded hover:bg-gray-200">Logout</button>
        </div>
      )}
    </div>
  );
}
