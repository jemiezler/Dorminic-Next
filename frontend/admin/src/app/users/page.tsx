export default function Users() {
  return (
    <main className="bg-white px-8">
      <section id="admins" className="grid grid-cols-12 py-6">
        <h1 className="text-xl font-bold col-span-12">Admin</h1>
        <div className="card flex bg-base-100 shadow-md p-4 col-span-12 md:col-span-6 border mt-4">
          <p>John Doe</p>
          <p>Moderator</p>
        </div>
      </section>
      <section id="users" className="grid grid-cols-12 py-6">
        <h1 className="text-xl font-bold col-span-12">Users</h1>
        <div className="card flex bg-base-100 shadow-md p-4 col-span-12 md:col-span-6 border mt-4">
          <p>John Doe</p>
          <p>Moderator</p>
        </div>
      </section>
    </main>
  );
}
