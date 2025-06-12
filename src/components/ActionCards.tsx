import { useToast } from '@/hooks/use-toast';

const ActionCards = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {/* Здесь можно добавить другие карточки действий, если они понадобятся */}
    </div>
  );
};

export default ActionCards;
