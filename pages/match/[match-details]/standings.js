export async function getServerSideProps(context) {
  const slug = context.params?.["match-details"];

  if (!slug) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    redirect: {
      destination: `/match/${slug}/matches?tab=standings`,
      permanent: false,
    },
  };
}

export default function MatchStandingsRedirect() {
  return null;
}
