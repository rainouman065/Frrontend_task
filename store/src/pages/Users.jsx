import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { endpoints, useApiMutation, useApiQuery } from '../api';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Users() {
  const navigate = useNavigate();

  const {
    myUsers,
    setMyUsers,
    deletedUserIds,
    nextLocalUserId,
    setNextLocalUserId,
  } = useData();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // ---------- Load Users ----------
  const { data: apiUsersRaw, isLoading: loading } = useApiQuery({
    queryKey: ['users'],
    url: endpoints.users,
  });
  const apiUsers = Array.isArray(apiUsersRaw) ? apiUsersRaw : [];

  const addUserMutation = useApiMutation({
    method: 'post',
    url: endpoints.users,
    body: {
      name,
      email,
      avatar: avatar || `https://i.pravatar.cc/150?u=${email}`,
    },
    invalidateKeys: [['users']],
  });

  const updateUserMutation = useApiMutation({
    method: 'put',
    url: (vars) => `${endpoints.users}/${vars.id}`,
    body: ({ id, ...rest }) => rest,
    invalidateKeys: [['users']],
  });

  const deleteUserMutation = useApiMutation({
    method: 'delete',
    url: (vars) => `${endpoints.users}/${vars.id}`,
    invalidateKeys: [['users']],
  });

  const users = useMemo(() => {
    const deletedIds = deletedUserIds.map(String);
    const api = apiUsers.filter(u => !deletedIds.includes(String(u.id)));
    return [...myUsers, ...api];
  }, [apiUsers, myUsers, deletedUserIds]);

  // ---------- ADD USER ----------

  async function handleAdd(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    const nextId = nextLocalUserId;
    setNextLocalUserId(nextId + 1);

    const newUser = {
      id: nextId,
      name,
      email,
      avatar: avatar || `https://i.pravatar.cc/150?u=${email}`,
      role: 'customer',
      isLocal: true,
    };

    try {
      const response = await addUserMutation.mutateAsync();
      if (response && response.id) {
        newUser.id = response.id;
        newUser.isLocal = false;
      }
    } catch (err) {
      console.error('Failed to add user via API:', err);
    }

    setMyUsers(prev => [newUser, ...prev]);

    setName('');
    setEmail('');
    setAvatar('');
    setIsAddModalOpen(false);

    Swal.fire('Added!', 'User added successfully.', 'success');
  }

  // ---------- EDIT ----------

  function openEdit(user) {
    setEditId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAvatar(user.avatar);
    setIsEditing(true);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();

    const index = myUsers.findIndex(u => u.id === editId);

    if (index !== -1) {
      setMyUsers(prev => {
        const next = [...prev];
        next[index] = { ...next[index], name: editName, email: editEmail, avatar: editAvatar };
        return next;
      });
    }

    try {
      await updateUserMutation.mutateAsync({
        id: editId,
        name: editName,
        email: editEmail,
        avatar: editAvatar,
      });
    } catch (err) {
      console.error('Failed to update user via API:', err);
    }

    setIsEditing(false);
    Swal.fire('Updated!', 'User updated successfully.', 'success');
  }

  // ---------- DELETE ----------

  function handleDelete(user) {
    Swal.fire({
      title: 'Delete user?',
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        actions: 'flex justify-end gap-2 mt-4',
        confirmButton: 'bg-[#e11d48] text-white px-4 py-2 rounded-lg no-hover',
        cancelButton: 'bg-[#9ca3af] text-white px-4 py-2 rounded-lg no-hover',
      },
    }).then(async result => {
      if (!result.isConfirmed) return;

      try {
        await deleteUserMutation.mutateAsync({ id: user.id });
      } catch (err) {
        console.error('Failed to delete user via API:', err);
      }

      setMyUsers(prev => prev.filter(u => u.id !== user.id));

      Swal.fire('Deleted!', 'User deleted.', 'success');
    });
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading users..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">


      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-amber-600 shadow-sm transition"
          >
            Add User
          </button>

          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg">
            Back
          </button>
        </div>
      </div>

      {/* Page size selector */}
      <div className="flex items-center justify-end mb-3 gap-2 text-sm">
        <span className="text-slate-600">Per page:</span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value) || 8);
            setPage(0);
          }}
          className="px-2 py-1 rounded-lg border border-slate-300 text-sm"
        >
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {users
          .slice(page * pageSize, page * pageSize + pageSize)
          .map(user => (
            <div key={user.id} className="bg-white shadow rounded-xl p-4 flex gap-3">
              <img src={user.avatar} className="w-14 h-14 rounded-full" />

              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm">{user.email}</p>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(user)} className="px-3 py-1 bg-slate-700 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user)} className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination controls */}
      {users.length > pageSize && (
        <div className="mt-6 flex justify-center items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-600">
            Page {page + 1} of {Math.max(1, Math.ceil(users.length / pageSize))}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage(p => {
                const maxPage = Math.max(0, Math.ceil(users.length / pageSize) - 1);
                return Math.min(p + 1, maxPage);
              })
            }
            disabled={(page + 1) * pageSize >= users.length}
            className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add User</h2>

            <form onSubmit={handleAdd} className="space-y-3">
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
              <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
              <input placeholder="Avatar URL" value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full border p-2 rounded" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="border px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border p-2 rounded" />
              <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full border p-2 rounded" />
              <input value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full border p-2 rounded" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Users;