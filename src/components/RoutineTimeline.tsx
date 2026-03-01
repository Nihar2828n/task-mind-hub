import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { FIXED_ROUTINE, RoutineBlock } from '@/lib/routine';

export default function RoutineTimeline() {
  return (
    <div className="space-y-1.5">
      {FIXED_ROUTINE.map((block, i) => (
        <RoutineCard key={block.id} block={block} index={i} />
      ))}
    </div>
  );
}

function RoutineCard({ block, index }: { block: RoutineBlock; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20"
    >
      <div className="flex items-center gap-1.5 text-primary shrink-0 w-[110px]">
        <Clock size={12} />
        <span className="text-[11px] font-semibold font-mono">{block.startTime}–{block.endTime}</span>
      </div>
      <span className="text-sm font-medium text-foreground">
        {block.emoji && <span className="mr-1.5">{block.emoji}</span>}
        {block.title}
      </span>
    </motion.div>
  );
}
