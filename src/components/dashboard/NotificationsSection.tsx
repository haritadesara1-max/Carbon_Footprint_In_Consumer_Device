import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, TrendingDown, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
const NotificationsSection = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase.channel('notifications').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user?.id}`
    }, payload => {
      setNotifications(prev => [payload.new, ...prev]);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  const fetchNotifications = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data || []);
    }
  };
  const markAsRead = async (id: string) => {
    const {
      error
    } = await supabase.from('notifications').update({
      read: true
    }).eq('id', id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read."
      });
    } else {
      fetchNotifications();
    }
  };
  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('tax')) return <TrendingDown className="h-5 w-5 text-primary" />;
    if (title.toLowerCase().includes('certificate')) return <Award className="h-5 w-5 text-primary" />;
    return <Bell className="h-5 w-5 text-primary" />;
  };
  return <Card className="carbon-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications & Updates
        </CardTitle>
        <CardDescription>Tax benefits, CSR/ESG updates, and sustainability achievements will be sent here </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              We'll notify you about tax benefits and sustainability achievements
            </p>
          </div> : <div className="space-y-4">
            {notifications.map(notification => <div key={notification.id} className={`border rounded-lg p-4 space-y-3 ${notification.read ? 'border-border bg-background' : 'border-primary/20 bg-primary/5'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getIcon(notification.title)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                      </p>
                    </div>
                  </div>
                  {!notification.read && <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>}
                </div>
              </div>)}
          </div>}

        
      </CardContent>
    </Card>;
};
export default NotificationsSection;