import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

const clickButtonByText = async (label: string | RegExp) => {
  const name = typeof label === 'string' ? new RegExp(label, 'i') : label;
  try {
    const btn = await screen.findByRole('button', { name });
    await userEvent.click(btn);
    return;
  } catch {
    // Fallback: scan all buttons and click the one containing the text
    const all = screen.getAllByRole('button');
    const target = all.find((b) => within(b).queryByText(name));
    if (!target) throw new Error(`Button not found: ${name}`);
    await userEvent.click(target);
  }
};

const readDashboardBalance = () => {
  const el = screen.getByTestId('balance-value');
  const text = el.textContent || '';
  const match = text.match(/\$([\d,]+\.\d{2})/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : NaN;
};

beforeEach(() => {
  localStorage.clear();
});

describe('Navigation and actions', () => {
  it('navigates via bottom tabs after demo login', async () => {
    render(<App />);

    await clickButtonByText('Try Demo Account');
    await screen.findByText(/Total Balance/i);

    // Navigate: Send via bottom nav
    await clickButtonByText(/^Send$/i);
    await screen.findByRole('heading', { name: /Send Money/i });

    // Navigate: Scan via bottom nav
    await clickButtonByText(/^Scan$/i);
    await screen.findByRole('heading', { name: /Scan QR Code/i });

    // Navigate: History via bottom nav
    await clickButtonByText(/^History$/i);
    await screen.findByRole('heading', { name: /Transactions/i });

    // Navigate: Profile via bottom nav
    await clickButtonByText(/^Profile$/i);
    await screen.findByRole('heading', { name: /^Profile$/i });

    // Back Home
    await clickButtonByText(/^Home$/i);
    await screen.findByText(/Total Balance/i);
  });

  it('deducts balance on send and records transaction', async () => {
    render(<App />);

    await clickButtonByText('Try Demo Account');
    await screen.findByText(/Total Balance/i);

    const initial = readDashboardBalance();
    expect(initial).toBeGreaterThan(0);

    // Go to Send via quick action tile on dashboard
    await userEvent.click(await screen.findByText(/Send Money/i));

    const amountInput = await screen.findByPlaceholderText('0.00');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '25');

    const contact = await screen.findByText(/Sarah Johnson/i);
    await userEvent.click(contact);

    await clickButtonByText(/Send \$25/i);

    // Immediately go Home; deduction happens synchronously before timeout
    await clickButtonByText(/^Home$/i);
    await screen.findByText(/Total Balance/i);

    const afterSend = readDashboardBalance();
    expect(Math.round((initial - afterSend) * 100)).toBe(2500);

    // Check history shows the sent transaction
    await clickButtonByText(/^History$/i);
    await screen.findByRole('heading', { name: /Transactions/i });
    const sentToSarah = await screen.findAllByText(/To Sarah Johnson/i);
    expect(sentToSarah.length).toBeGreaterThan(0);
  });
});

describe('Per-user balance isolation', () => {
  it('logs out and logs in as Jane, showing her balance', async () => {
    render(<App />);

    // Login demo first
    await clickButtonByText('Try Demo Account');
    await screen.findByText(/Total Balance/i);

    // Go Profile and Sign Out
    await clickButtonByText(/^Profile$/i);
    await screen.findByRole('heading', { name: /^Profile$/i });
    await userEvent.click(await screen.findByText(/Sign Out/i));

    // Back at Auth, login as Jane
    const email = await screen.findByLabelText(/Email/i);
    const password = await screen.findByLabelText(/Password/i);
    await userEvent.type(email, 'jane.smith@example.com');
    await userEvent.type(password, 'password123');
    await clickButtonByText(/Sign in/i);

    // Dashboard for Jane
    await screen.findByText(/Total Balance/i);
    const balance = readDashboardBalance();
    expect(Math.round(balance * 100)).toBe(Math.round(8750.25 * 100));
  });
});