export async function getServerSideProps(context) {
  const slug = context.params?.["team-details"];

  if (!slug) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    redirect: {
      destination: `/team/${slug}/results?tab=players`,
      permanent: false,
    },
  };
}

export default function TeamPlayersRedirect() {
  return null;
}
