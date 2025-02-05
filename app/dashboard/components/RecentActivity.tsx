import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "Alice Dubois",
    action: "a soumis un devoir",
    course: "Mathématiques Avancées",
    time: "Il y a 2 heures",
  },
  {
    user: "Thomas Martin",
    action: "a posé une question",
    course: "Physique Quantique",
    time: "Il y a 4 heures",
  },
  {
    user: "Sophie Lefebvre",
    action: "a terminé un quiz",
    course: "Chimie Organique",
    time: "Il y a 1 jour",
  },
  {
    user: "Lucas Moreau",
    action: "s'est inscrit au cours de Programmation Avancée",
    time: "Il y a 2 jours",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>{activity.user[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} - {activity.course}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

