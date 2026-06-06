export async function getServerSideProps(context) {
  const slug = context.params?.["team-details"];

  if (!slug) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    redirect: {
      destination: `/team/${slug}/results?tab=standings`,
      permanent: false,
    },
  };
}

export default function TeamStandingsRedirect() {
  return null;
}
