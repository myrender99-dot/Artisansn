import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Trash2, LogOut, Users, Calendar, Star, Clock } from "lucide-react";

const TOKEN_KEY = "artisansn_admin_token";
const EMAIL_KEY = "artisansn_admin_email";

type Artisan = {
  id: number;
  name: string;
  category: string;
  city: string;
  phone: string;
  email?: string | null;
  isVerified: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
};

type Booking = {
  id: number;
  artisanId: number;
  clientName: string;
  clientPhone: string;
  serviceDescription: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  city?: string | null;
  scheduledDate?: string | null;
  createdAt: string;
};

type Review = {
  id: number;
  artisanId: number;
  clientName: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

type Overview = {
  totalArtisans: number;
  totalBookings: number;
  totalReviews: number;
  pendingArtisans: number;
  pendingBookings: number;
};

function api(token: string, path: string, init: RequestInit = {}) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return fetch(`${base}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": token,
      ...(init.headers ?? {}),
    },
  });
}

function LoginForm({ onLogin }: { onLogin: (token: string, email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Connexion échouée");
      }
      const data = await res.json();
      onLogin(data.token, data.email);
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Connexion impossible",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Administration Teranga Services</CardTitle>
          <p className="text-sm text-muted-foreground">Connectez-vous pour gérer la plateforme</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@artisansn.sn"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: number | string; hint?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function statusVariant(status: Booking["status"]) {
  switch (status) {
    case "pending": return "secondary";
    case "confirmed": return "default";
    case "completed": return "default";
    case "cancelled": return "destructive";
  }
}

function Dashboard({ token, email, onLogout }: { token: string; email: string; onLogout: () => void }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [o, a, b, r] = await Promise.all([
        api(token, "/admin/overview").then((r) => r.json()),
        api(token, "/admin/artisans").then((r) => r.json()),
        api(token, "/admin/bookings").then((r) => r.json()),
        api(token, "/admin/reviews").then((r) => r.json()),
      ]);
      setOverview(o);
      setArtisans(a.artisans ?? []);
      setBookings(b.bookings ?? []);
      setReviews(r.reviews ?? []);
    } catch {
      toast({ title: "Erreur", description: "Chargement impossible", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => { refresh(); }, [refresh]);

  async function toggleVerify(a: Artisan) {
    await api(token, `/admin/artisans/${a.id}/verify`, {
      method: "POST",
      body: JSON.stringify({ isVerified: !a.isVerified }),
    });
    toast({ title: a.isVerified ? "Vérification retirée" : "Artisan vérifié" });
    refresh();
  }

  async function deleteArtisan(id: number) {
    if (!confirm("Supprimer cet artisan et toutes ses données ?")) return;
    await api(token, `/admin/artisans/${id}`, { method: "DELETE" });
    toast({ title: "Artisan supprimé" });
    refresh();
  }

  async function changeStatus(id: number, status: string) {
    await api(token, `/admin/bookings/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function deleteBooking(id: number) {
    if (!confirm("Supprimer cette réservation ?")) return;
    await api(token, `/admin/bookings/${id}`, { method: "DELETE" });
    toast({ title: "Réservation supprimée" });
    refresh();
  }

  async function deleteReview(id: number) {
    if (!confirm("Supprimer cet avis ?")) return;
    await api(token, `/admin/reviews/${id}`, { method: "DELETE" });
    toast({ title: "Avis supprimé" });
    refresh();
  }

  if (loading && !overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-sm text-muted-foreground">Connecté en tant que {email}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={Users} label="Artisans" value={overview.totalArtisans} hint={`${overview.pendingArtisans} en attente`} />
            <StatCard icon={Calendar} label="Réservations" value={overview.totalBookings} hint={`${overview.pendingBookings} à traiter`} />
            <StatCard icon={Star} label="Avis" value={overview.totalReviews} />
            <StatCard icon={Clock} label="À vérifier" value={overview.pendingArtisans} />
            <StatCard icon={Clock} label="En attente" value={overview.pendingBookings} />
          </div>
        )}

        <Tabs defaultValue="artisans">
          <TabsList>
            <TabsTrigger value="artisans">Artisans ({artisans.length})</TabsTrigger>
            <TabsTrigger value="bookings">Réservations ({bookings.length})</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="artisans" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artisans.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.name}</TableCell>
                        <TableCell>{a.category}</TableCell>
                        <TableCell>{a.city}</TableCell>
                        <TableCell>{a.phone}</TableCell>
                        <TableCell>{a.averageRating.toFixed(1)} ({a.reviewCount})</TableCell>
                        <TableCell>
                          {a.isVerified ? (
                            <Badge>Vérifié</Badge>
                          ) : (
                            <Badge variant="secondary">Non vérifié</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => toggleVerify(a)}>
                            {a.isVerified ? "Retirer" : "Vérifier"}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteArtisan(a.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Artisan #</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.clientName}</TableCell>
                        <TableCell>{b.clientPhone}</TableCell>
                        <TableCell>{b.artisanId}</TableCell>
                        <TableCell className="max-w-xs truncate">{b.serviceDescription}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Select value={b.status} onValueChange={(v) => changeStatus(b.id, v)}>
                            <SelectTrigger className="w-36 inline-flex">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmée</SelectItem>
                              <SelectItem value="completed">Terminée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="destructive" onClick={() => deleteBooking(b.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Artisan #</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.clientName}</TableCell>
                        <TableCell>{r.artisanId}</TableCell>
                        <TableCell>{"★".repeat(r.rating)}</TableCell>
                        <TableCell className="max-w-md truncate">{r.comment}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive" onClick={() => deleteReview(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState<string>(() => localStorage.getItem(EMAIL_KEY) ?? "");

  function handleLogin(t: string, e: string) {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(EMAIL_KEY, e);
    setToken(t);
    setEmail(e);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail("");
  }

  if (!token) return <LoginForm onLogin={handleLogin} />;
  return <Dashboard token={token} email={email} onLogout={handleLogout} />;
}
