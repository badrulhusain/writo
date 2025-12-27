import { getHomeData } from "@/lib/services/blog-service";
import { currentUser } from "@/lib/auth";
import { User } from "@/lib/db";
import HomeClient from "./components/HomeClient";

async function getUserId() {
  const clerkUser = await currentUser();
  if (!clerkUser || !clerkUser.emailAddresses?.length) return null;

  const email = clerkUser.emailAddresses[0].emailAddress;
  const dbUser = await User.findOne({ email }) as any;
  return dbUser ? dbUser._id.toString() : null;
}

export default async function HomePage() {
  const userId = await getUserId();
  const data = await getHomeData(userId);

  return (
    <HomeClient
      initialBlogs={data.blogs}
      initialCategories={data.categories}
      initialTags={data.tags}
      initialUsers={data.users}
    />
  );
}
