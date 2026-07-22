# frozen_string_literal: true

module Candidates
  class StatusPolicy
    FINAL_STATUSES = %w[accepted rejected].freeze
    ALLOWED_TARGETS = %w[accepted rejected].freeze

    Result = Struct.new(:ok?, :reviewed, :error_code, keyword_init: true)

    def self.apply(current_status:, new_status:)
      new(current_status: current_status, new_status: new_status).apply
    end

    def initialize(current_status:, new_status:)
      @current_status = current_status.to_s
      @new_status = new_status.to_s
    end

    def apply
      return failure(:invalid_status) unless Candidate::STATUSES.include?(@new_status)
      return failure(:status_locked) if FINAL_STATUSES.include?(@current_status)
      return failure(:invalid_transition) unless @current_status == "pending" && ALLOWED_TARGETS.include?(@new_status)

      Result.new(ok?: true, reviewed: true, error_code: nil)
    end

    private

    def failure(code)
      Result.new(ok?: false, reviewed: nil, error_code: code)
    end
  end
end
