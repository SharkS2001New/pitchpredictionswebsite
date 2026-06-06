export async function getServerSideProps(context) {
  const slug = context.params?.["match-details"];

  if (!slug) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    redirect: {
      destination: `/match/${slug}/matches?tab=summary`,
      permanent: false,
    },
  };
}

export default function MatchOverallStatisticsRedirect() {
  return null;
}
