# frozen_string_literal: true

require 'fast_spec_helper'

describe Gitlab::Tracing::Sidekiq::ServerMiddleware do
  describe '#call' do
    let(:worker_class) { 'test_worker_class' }
    let(:job) { {} }
    let(:queue) { 'test_queue' }
    let(:custom_error) { Class.new(StandardError) }

    subject { described_class.new() }

    it 'yields' do
      expect { |b| subject.call(worker_class, job, queue, &b) }.to yield_control
    end

    it 'propagates exceptions' do
      expect { subject.call(worker_class, job, queue) { raise custom_error } }.to raise_error(custom_error)
    end
  end
end
