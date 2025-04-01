# Slack Clone

A feature-rich Slack clone built with modern technologies, providing real-time communication and collaboration for teams.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.dev/)
- **State Management**: [Jotai](https://jotai.org/)
- **Backend**: [Convex](https://convex.dev/) + [Auth.js v5](https://authjs.dev/)

## ✨ Key Features

- **📡 Real-Time Communication**: Instant messaging with real-time updates.
- **👍 Reactions to Messages**: Add emoji reactions to messages.
- **🧵 Threads / Replies System**: Organize conversations with threaded replies.
- **✏️ Editing Messages**: Edit sent messages for corrections or updates.
- **🗑️ Deleting Messages**: Remove messages when necessary.
- **🔐 Role-Based Access Control**: Manage permissions for users based on roles.
- **🖼️ Image Attachments**: Upload and share images in messages.
- **🔒 Authentication**: Secure login with [NextAuth.js v5](https://authjs.dev/).
- **📺 Channel Creation**: Create and manage channels for focused discussions.
- **🏢 Workspace Creation**: Set up workspaces for team collaboration.
- **✉️ Invite System / Invite Codes**: Invite users to workspaces via email or invite codes.
- **💬 Direct Messaging**: Private conversations between users.
- **👥 User Profiles**: View and manage user profiles.

## 🎨 UI/UX

- Built with **shadcn/ui** for a modern and accessible design system.
- Styled using **Tailwind CSS** for rapid and responsive UI development.

## 🚀 Deployment

- Hosted on [Vercel](https://vercel.com/) for fast and reliable performance.
- **Live Demo**: [slack-rebuild.vercel.app](https://slack-rebuild.vercel.app/)

## 🛠️ Development

To run the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/slack-clone.git
   cd slack-clone
   ```

2. Install dependencies using `bun`:

   ```bash
   bun install
   ```

3. Create a `.env` file and configure the required environment variables:

   ```env
   CONVEX_DEPLOYMENT=dev:your-convex-deployment
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
   ```

4. Start the development server:

   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
