import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Trophy, Medal, Award, TrendingUp, Flame, Code, CheckCircle2, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { batches } from '../lib/data';
import { toast } from 'sonner';
import { exportToCSV, exportToPDF } from '../lib/exportUtils';

export function Leaderboard() {
  const { currentUser } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  const canViewAllBatches = currentUser?.role === 'admin';

  const globalLeaderboard = [
    { rank: 1, name: 'Sophia Chen', points: 3250, solved: 42, streak: 15, badges: 8, change: 0 },
    { rank: 2, name: 'Alex Kumar', points: 3180, solved: 40, streak: 12, badges: 7, change: 1 },
    { rank: 3, name: 'Emma Wilson', points: 2950, solved: 38, streak: 7, badges: 6, change: -1 },
    { rank: 4, name: 'Liam Martinez', points: 2840, solved: 36, streak: 10, badges: 5, change: 2 },
    { rank: 5, name: 'Olivia Taylor', points: 2720, solved: 34, streak: 5, badges: 5, change: 0 },
    { rank: 6, name: 'Noah Anderson', points: 2650, solved: 33, streak: 8, badges: 4, change: -2 },
    { rank: 7, name: 'Ava Brown', points: 2580, solved: 32, streak: 6, badges: 4, change: 1 },
    { rank: 8, name: 'Ethan Davis', points: 2450, solved: 30, streak: 4, badges: 3, change: 0 },
    { rank: 9, name: 'Isabella Garcia', points: 2380, solved: 29, streak: 9, badges: 4, change: 3 },
    { rank: 10, name: 'Mason Lee', points: 2290, solved: 28, streak: 11, badges: 3, change: -1 },
  ];

  const weeklyLeaderboard = [
    { rank: 1, name: 'Liam Martinez', points: 580, solved: 8, change: 'up' },
    { rank: 2, name: 'Emma Wilson', points: 520, solved: 7, change: 'new' },
    { rank: 3, name: 'Sophia Chen', points: 480, solved: 6, change: 'down' },
  ];

  const achievementBadges = [
    { name: 'Speed Solver', icon: '⚡', description: 'Solve 5 problems in under 30 minutes', rarity: 'rare' },
    { name: 'Streak Master', icon: '🔥', description: 'Maintain a 30-day solving streak', rarity: 'epic' },
    { name: 'First Blood', icon: '🎯', description: 'First to solve a newly released problem', rarity: 'legendary' },
    { name: 'Night Owl', icon: '🦉', description: 'Solve 10 problems after midnight', rarity: 'common' },
    { name: 'Perfectionist', icon: '✨', description: 'Solve 20 problems on first attempt', rarity: 'rare' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm text-neutral-600">{rank}</span>;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-neutral-100 text-neutral-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const exportLeaderboard = (format: 'excel' | 'pdf') => {
    const data = globalLeaderboard;
    const headers = ['Rank', 'Name', 'Points', 'Solved', 'Streak', 'Badges'];
    const rows = data.map(user => [user.rank, user.name, user.points, user.solved, user.streak, user.badges]);
    const filenameBase = `leaderboard_${selectedBatch === 'all' ? 'all_batches' : selectedBatch}_${new Date().toISOString().split('T')[0]}`;
    if (format === 'pdf') {
      exportToPDF(filenameBase, 'Leaderboard', headers, rows);
      toast.success('PDF export started');
    } else {
      exportToCSV(filenameBase, headers, rows);
      toast.success('Excel export started');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">

      {/* ── Header + admin toolbar (compact, no stretched buttons) ── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Leaderboard</h2>
            <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed max-w-xl">
              {canViewAllBatches
                ? 'Compare learners across batches and export rankings when you need a snapshot.'
                : 'See how you stack up and keep your streak going.'}
            </p>
          </div>
          {canViewAllBatches && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto sm:max-w-md">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="h-10 w-full sm:w-[200px] border border-neutral-200 bg-neutral-50/80 hover:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="h-10 px-4 shrink-0 w-full sm:w-auto text-white shadow-sm hover:opacity-90 rounded-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Download className="w-4 h-4 mr-2 shrink-0" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => exportLeaderboard('excel')}>
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-2" /> Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportLeaderboard('pdf')}>
                    <FileText className="w-3.5 h-3.5 mr-2" /> PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* ── Your stats (compact on larger screens) ── */}
      <Card className="overflow-hidden border border-neutral-200/90 shadow-sm bg-gradient-to-br from-white to-neutral-50/50">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Your rank</p>
                <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">#12</p>
                <p className="text-sm text-neutral-600">Emma Wilson</p>
              </div>
            </div>
            <div className="h-px sm:h-auto sm:w-px bg-neutral-200 sm:min-h-[52px] shrink-0" aria-hidden />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 flex-1 min-w-0">
              {[
                { label: 'Points', value: '1,850' },
                { label: 'Solved', value: '23' },
                { label: 'Streak', value: '7', icon: Flame, iconColor: 'var(--color-warning)' },
                { label: 'Badges', value: '4' },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-neutral-100 bg-white/80 px-3 py-2.5 text-center sm:text-left"
                  >
                    <p className="text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                      {StatIcon ? (
                        <StatIcon className="w-3.5 h-3.5 shrink-0" style={{ color: stat.iconColor }} />
                      ) : null}
                      <p className="font-mono font-semibold text-base text-neutral-900">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Rankings card */}
        <Card className="lg:col-span-2 border-neutral-200/90 shadow-sm">
          <CardHeader className="pb-0 border-b border-neutral-100/80">
            <CardTitle className="text-lg">Rankings</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <Tabs defaultValue="global">
              <TabsList className="mb-4 w-full sm:w-fit bg-neutral-100/90 p-1 rounded-full">
                <TabsTrigger
                  value="global"
                  className="flex-1 sm:flex-none rounded-full px-4 data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white data-[state=inactive]:text-neutral-600"
                >
                  Global
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className="flex-1 sm:flex-none rounded-full px-4 data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white data-[state=inactive]:text-neutral-600"
                >
                  This Week
                </TabsTrigger>
                <TabsTrigger
                  value="batch"
                  className="flex-1 sm:flex-none rounded-full px-4 data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white data-[state=inactive]:text-neutral-600"
                >
                  My Batch
                </TabsTrigger>
              </TabsList>

              {/* Global tab */}
              <TabsContent value="global" className="space-y-2">
                {globalLeaderboard.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`rounded-xl p-3 sm:p-4 border transition-colors ${
                      user.rank === 1
                        ? 'bg-gradient-to-r from-amber-50/90 to-white border-amber-200/80 shadow-sm'
                        : user.rank === 2
                          ? 'bg-gradient-to-r from-slate-50 to-white border-slate-200/80'
                          : user.rank === 3
                            ? 'bg-gradient-to-r from-orange-50/80 to-white border-orange-200/70'
                            : 'bg-white border-neutral-200/70 hover:border-neutral-300 hover:bg-neutral-50/50'
                    }`}
                  >
                    {/* Mobile layout */}
                    <div className="flex items-center gap-3 sm:hidden">
                      {/* Rank icon */}
                      <div className="w-7 flex justify-center shrink-0">
                        {getRankIcon(user.rank)}
                      </div>
                      {/* Avatar */}
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="text-xs" style={{
                          backgroundColor: user.rank <= 3 ? 'var(--color-primary)' : '#e5e5e5',
                          color: user.rank <= 3 ? 'white' : '#525252',
                        }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {/* Name + stats */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-sm text-neutral-900 truncate">{user.name}</p>
                          {index === 2 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">You</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                          <span>✓ {user.solved}</span>
                          <span>🔥 {user.streak}d</span>
                          <span>🏅 {user.badges}</span>
                        </div>
                      </div>
                      {/* Points */}
                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-sm text-neutral-900">{user.points.toLocaleString()}</p>
                        <p className="text-[10px] text-neutral-400">pts</p>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar>
                          <AvatarFallback style={{
                            backgroundColor: user.rank <= 3 ? 'var(--color-primary)' : 'var(--color-neutral-200)',
                            color: user.rank <= 3 ? 'white' : 'var(--color-neutral-700)',
                          }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            {index === 2 && <Badge variant="outline">You</Badge>}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />{user.solved} solved
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />{user.streak} day streak
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3" />{user.badges} badges
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-mono">{user.points.toLocaleString()}</p>
                          <p className="text-xs text-neutral-600">points</p>
                        </div>
                        {user.change !== 0 && (
                          <div className={`flex items-center gap-1 ${user.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className={`w-4 h-4 ${user.change < 0 ? 'rotate-180' : ''}`} />
                            <span className="text-sm">{Math.abs(user.change)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Weekly tab */}
              <TabsContent value="weekly" className="space-y-2">
                {weeklyLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 sm:w-10 flex justify-center shrink-0">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarFallback style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{user.name}</p>
                        <p className="text-xs text-neutral-500">{user.solved} problems this week</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <p className="font-mono text-sm font-bold">{user.points} pts</p>
                      {user.change === 'new' && <Badge className="bg-green-100 text-green-700 text-[10px]">New</Badge>}
                      {user.change === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {user.change === 'down' && <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Batch tab */}
              <TabsContent value="batch">
                <p className="text-sm text-neutral-600 text-center py-8">Batch leaderboard coming soon</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ── Right column: Achievements + Progress ── */}
        <div className="space-y-4 sm:space-y-6">

          {/* Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {achievementBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="p-2.5 sm:p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="text-xl sm:text-2xl shrink-0">{badge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <p className="text-sm font-medium">{badge.name}</p>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">{badge.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress This Month */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Progress This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600">Problems Solved</span>
                  <span className="font-mono font-medium">8 / 15</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '53%', backgroundColor: 'var(--color-primary)' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600">Learning Hours</span>
                  <span className="font-mono font-medium">24 / 40</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: 'var(--color-secondary)' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600">Streak Goal</span>
                  <span className="font-mono font-medium">7 / 30</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '23%', backgroundColor: 'var(--color-warning)' }} />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}