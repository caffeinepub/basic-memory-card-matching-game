import { useState, useEffect, useRef } from 'react';
import { MemoryCard } from './MemoryCard';
import { useMemoryGame } from './useMemoryGame';
import { useTimer } from './useTimer';
import { useCardBackImage } from './useCardBackImage';
import { useProgress } from './useProgress';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Level, DIFFICULTY_CONFIGS } from './types';
import { getGridClass } from './utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RotateCcw, Trophy, Clock, Target, Upload, X, ChevronRight, LogIn, Award } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

export function MemoryGameView() {
  const [level, setLevel] = useState<Level>(1);
  const { cards, moves, isLocked, isComplete, flipCard, resetGame } = useMemoryGame(level);
  const { formattedTime, start, stop, reset: resetTimer } = useTimer();
  const { cardBackSrc, previewSrc, error, handleFileSelect, applyCustomImage, resetToDefault } = useCardBackImage();
  const { 
    isAuthenticated, 
    completedCount, 
    isBadgeMinted, 
    canMint, 
    isLoading: isProgressLoading,
    completeLevel,
    isCompletingLevel,
    mintBadge,
    isMintingBadge,
  } = useProgress();
  const { login } = useInternetIdentity();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start timer on first move
  useEffect(() => {
    if (moves === 1) {
      start();
    }
  }, [moves, start]);

  // Stop timer and record completion when complete
  useEffect(() => {
    if (isComplete) {
      stop();
      // Record level completion if authenticated
      if (isAuthenticated) {
        completeLevel(level);
      }
    }
  }, [isComplete, stop, isAuthenticated, level, completeLevel]);

  const handleNewGame = () => {
    resetGame(level);
    resetTimer();
  };

  const handleLevelChange = (newLevel: string) => {
    const lvl = parseInt(newLevel) as Level;
    setLevel(lvl);
    resetGame(lvl);
    resetTimer();
  };

  const handleNextLevel = () => {
    if (level < 10) {
      const nextLevel = (level + 1) as Level;
      setLevel(nextLevel);
      resetGame(nextLevel);
      resetTimer();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleApplyImage = () => {
    applyCustomImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetImage = () => {
    resetToDefault();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMintBadge = () => {
    if (canMint) {
      mintBadge();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <img
                  src="/assets/generated/app-icon.dim_512x512.png"
                  alt="Memory Game"
                  className="w-8 h-8"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Memory Match
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Select value={level.toString()} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DIFFICULTY_CONFIGS) as unknown as Level[]).map((lvl) => (
                    <SelectItem key={lvl} value={lvl.toString()}>
                      {DIFFICULTY_CONFIGS[lvl].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleNewGame} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats Panel */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Moves</p>
                    <p className="text-2xl font-bold">{moves}</p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-2xl font-bold font-mono">{formattedTime}</p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Matched</p>
                    <p className="text-2xl font-bold">
                      {cards.filter((c) => c.isMatched).length / 2} / {cards.length / 2}
                    </p>
                  </div>
                </div>

                {isAuthenticated && (
                  <>
                    <Separator orientation="vertical" className="h-12 hidden sm:block" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-2xl font-bold">
                          {isProgressLoading ? '...' : `${completedCount}/10`}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Login Prompt for Unauthenticated Users */}
          {!isAuthenticated && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-medium">Save your progress and earn a completion badge!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Log in to track your completed levels and mint a badge when you finish all 10 levels.
                    </p>
                  </div>
                  <Button onClick={login} className="gap-2 shrink-0">
                    <LogIn className="h-4 w-4" />
                    Log In to Save Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Badge Claim Section */}
          {isAuthenticated && completedCount >= 10 && (
            <Card className="border-2 border-success bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-success" />
                  <span>Completion Badge</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isBadgeMinted ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src="/assets/generated/completion-badge.dim_512x512.png"
                      alt="Completion Badge"
                      className="w-32 h-32 object-contain"
                    />
                    <div className="text-center">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        Badge Minted! 🎉
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Congratulations on completing all 10 levels!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src="/assets/generated/completion-badge.dim_512x512.png"
                      alt="Completion Badge"
                      className="w-24 h-24 object-contain"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-medium">You've completed all 10 levels!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mint your completion badge to commemorate your achievement.
                      </p>
                    </div>
                    <Button
                      onClick={handleMintBadge}
                      disabled={!canMint || isMintingBadge}
                      className="gap-2 shrink-0"
                    >
                      {isMintingBadge ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Award className="h-4 w-4" />
                          Mint Badge
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Card Back Customization */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Card Back Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Current/Preview Image */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg border-2 border-border overflow-hidden bg-card shadow-sm">
                    <img
                      src={previewSrc || cardBackSrc}
                      alt="Card back preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="card-back-upload" className="text-sm font-medium">
                      {previewSrc ? 'Preview' : 'Current card back'}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose an image to customize
                    </p>
                  </div>
                </div>

                {/* File Input and Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <input
                    ref={fileInputRef}
                    id="card-back-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Button>
                  {previewSrc && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleApplyImage}
                      className="gap-2"
                    >
                      Apply
                    </Button>
                  )}
                  {cardBackSrc !== '/assets/generated/card-back.dim_1024x1024.png' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetImage}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reset to Default
                    </Button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Grid */}
          <div
            className={`grid gap-3 sm:gap-4 ${getGridClass(level)} auto-rows-fr`}
            style={{ maxWidth: '100%' }}
          >
            {cards.map((card) => (
              <MemoryCard
                key={card.id}
                card={card}
                onFlip={flipCard}
                disabled={isLocked || isComplete}
                cardBackSrc={cardBackSrc}
              />
            ))}
          </div>

          {/* Win State */}
          {isComplete && (
            <Card className="border-2 border-success bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <Trophy className="h-8 w-8 text-success" />
                  <span>{level === 10 ? 'All Levels Complete!' : 'Level Complete!'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-lg">
                  You completed {level === 10 ? 'the final level' : `Level ${level}`} in{' '}
                  <Badge variant="secondary" className="text-lg px-3 py-1">{moves}</Badge> moves
                  and <Badge variant="secondary" className="text-lg px-3 py-1">{formattedTime}</Badge>!
                </p>
                {level === 10 && (
                  <p className="text-center text-muted-foreground">
                    Congratulations on completing all 10 levels! 🎉
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={handleNewGame} variant="outline" className="gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Play Again
                  </Button>
                  {level < 10 && (
                    <Button onClick={handleNextLevel} className="gap-2">
                      Next Level
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                {!isAuthenticated && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Log in to save your progress!
                    </p>
                    <Button onClick={login} variant="secondary" size="sm" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Log In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              Built with <SiCaffeine className="h-4 w-4 text-primary" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors underline decoration-primary/30 hover:decoration-primary"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
