document.addEventListener('DOMContentLoaded', () => {
  const usersList = document.getElementById('users-list');

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      renderUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      usersList.innerHTML = '<p>Error loading users. Check the console for details.</p>';
    }
  }

  function renderUsers(users) {
    if (!users.length) {
      usersList.innerHTML = '<p>No users found.</p>';
      return;
    }

    const userItems = users.map(user => `
      <article>
        <h4>${user.name}</h4>
        <p><strong>Phone:</strong> ${user.phoneNumber || 'N/A'}</p>
        <p><strong>ID:</strong> ${user.id}</p>
      </article>
    `).join('');

    usersList.innerHTML = userItems;
  }

  fetchUsers();
});
