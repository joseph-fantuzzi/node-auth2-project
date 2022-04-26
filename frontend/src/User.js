function User({ userid, username, role_name }) {
  return (
    <div>
      <p>{`USER ID: ${userid}`}</p>
      <p>{`USERNAME: ${username}`}</p>
      <p>{`ROLE NAME: ${role_name}`}</p>
    </div>
  );
}

export default User;
