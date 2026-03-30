-- Migration 006: Transaction balance trigger
-- Source: Phase 5 Section 3 — Transaction balance trigger
--
-- Adjusts accounts.balance on transaction INSERT, UPDATE, DELETE.
-- More reliable than application logic because it cannot be bypassed.
--
-- Logic:
--   income → adds to balance
--   expense/transfer → subtracts from balance
--   On UPDATE: reverses old amount, applies new amount
--   On DELETE: reverses the amount

CREATE OR REPLACE FUNCTION public.handle_transaction_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_delta numeric(12,2) := 0;
  new_delta numeric(12,2) := 0;
BEGIN
  -- Calculate old delta (for UPDATE and DELETE)
  IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    IF OLD.type = 'income' THEN
      old_delta := OLD.amount;
    ELSE
      old_delta := -OLD.amount;
    END IF;
  END IF;

  -- Calculate new delta (for INSERT and UPDATE)
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.type = 'income' THEN
      new_delta := NEW.amount;
    ELSE
      new_delta := -NEW.amount;
    END IF;
  END IF;

  -- Apply balance changes
  IF TG_OP = 'INSERT' THEN
    UPDATE public.accounts SET balance = balance + new_delta WHERE id = NEW.account_id;
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    -- If account changed, reverse from old account and apply to new
    IF OLD.account_id <> NEW.account_id THEN
      UPDATE public.accounts SET balance = balance - old_delta WHERE id = OLD.account_id;
      UPDATE public.accounts SET balance = balance + new_delta WHERE id = NEW.account_id;
    ELSE
      -- Same account: apply the difference
      UPDATE public.accounts SET balance = balance - old_delta + new_delta WHERE id = NEW.account_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.accounts SET balance = balance - old_delta WHERE id = OLD.account_id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

CREATE TRIGGER on_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_transaction_balance();
