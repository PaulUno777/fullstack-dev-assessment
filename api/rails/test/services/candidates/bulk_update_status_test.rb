# frozen_string_literal: true

require "test_helper"

class CandidatesBulkUpdateStatusTest < ActiveSupport::TestCase
  setup do
    @pending = Candidate.create!(
      name: "Pending One",
      years_exp: 2,
      status: "pending",
      date_applied: Time.zone.parse("2018-06-01 10:00:00"),
      reviewed: false,
      description: "a"
    )
    @locked = Candidate.create!(
      name: "Locked One",
      years_exp: 4,
      status: "accepted",
      date_applied: Time.zone.parse("2018-06-02 10:00:00"),
      reviewed: true,
      description: "b"
    )
  end

  test "updates pending and reports locked failures" do
    result = Candidates::BulkUpdateStatus.call(
      ids: [ @pending.id, @locked.id, 0 ],
      status: "rejected"
    )

    assert_equal 1, result.updated.length
    assert_equal "rejected", result.updated.first.status
    assert_equal 2, result.errors.length
    codes = result.errors.map { |error| error.code.to_s }
    assert_includes codes, "status_locked"
    assert_includes codes, "not_found"
  end
end
